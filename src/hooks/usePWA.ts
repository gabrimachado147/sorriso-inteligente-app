import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '@/lib/offline-storage';

interface PWAPrompt {
  prompt: () => void;
  outcome: 'accepted' | 'dismissed' | null;
}

interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  prompt: PWAPrompt | null;
  installApp: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  hasUpdate: boolean;
  updateAvailable: boolean;
  backgroundSyncStatus: 'idle' | 'syncing' | 'failed';
  installMetrics: {
    installPromptShown: number;
    installAccepted: number;
    installDismissed: number;
  };
  applyUpdate: () => Promise<void>;
  storageUsage: { used: number; quota: number; percentage: number };
  getStorageUsage: () => Promise<{ used: number; quota: number; percentage: number }>;
  clearOfflineData: () => Promise<boolean>;
  syncOfflineData: () => Promise<boolean>;
  getMetrics: () => Promise<{
    install: {
      installPromptShown: number;
      installAccepted: number;
      installDismissed: number;
    };
    storage: { used: number; quota: number; percentage: number };
    online: boolean;
    installed: boolean;
    standalone: boolean;
    updateAvailable: boolean;
    backgroundSyncStatus: 'idle' | 'syncing' | 'failed';
  }>;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Enhanced navigator with PWA features
declare global {
  interface Navigator {
    standalone?: boolean;
  }
  interface Window {
    __PWA_SW_UPDATE_AVAILABLE__?: boolean;
  }
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

export const usePWA = (): PWAHook => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [promptOutcome, setPromptOutcome] = useState<'accepted' | 'dismissed' | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [backgroundSyncStatus, setBackgroundSyncStatus] = useState<'idle' | 'syncing' | 'failed'>('idle');
  const [installMetrics, setInstallMetrics] = useState({
    installPromptShown: 0,
    installAccepted: 0,
    installDismissed: 0
  });
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 0, percentage: 0 });

  // Load metrics from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pwa-install-metrics');
    if (stored) {
      try {
        setInstallMetrics(JSON.parse(stored));
      } catch (error) {
        console.warn('[PWA] Failed to parse install metrics:', error);
      }
    }
  }, []);

  // Save metrics to localStorage
  const updateMetrics = useCallback((updates: Partial<typeof installMetrics>) => {
    setInstallMetrics(prev => {
      const newMetrics = { ...prev, ...updates };
      localStorage.setItem('pwa-install-metrics', JSON.stringify(newMetrics));
      return newMetrics;
    });
  }, []);

  useEffect(() => {
    // Verificar se é standalone (já instalado)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as Navigator & { standalone?: boolean }).standalone ||
                              document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };

    // Enhanced beforeinstallprompt handler with metrics
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Track install prompt shown
      updateMetrics({ installPromptShown: installMetrics.installPromptShown + 1 });
      
      console.log('[PWA] App is installable');
      
      // Observability: Log install prompt availability
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_install_prompt_shown', {
          event_category: 'PWA',
          event_label: 'Install Prompt Available'
        });
      }
    };

    // Enhanced online/offline handlers with background sync
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        setBackgroundSyncStatus('syncing');
        // Trigger background sync when coming online
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            // Check if sync is supported
            if (registration.sync) {
              return registration.sync.register('background-sync-appointments');
            } else {
              // Fallback: trigger manual sync
              console.log('[PWA] Background sync not supported, using fallback');
              return Promise.resolve();
            }
          }).then(() => {
            console.log('[PWA] Background sync triggered');
            setBackgroundSyncStatus('idle');
          }).catch(error => {
            console.error('[PWA] Background sync failed:', error);
            setBackgroundSyncStatus('failed');
          });
        }
      }
    };

    const handleOfflineStatus = () => {
      setIsOnline(navigator.onLine);
      console.log('[PWA] Network: Offline mode activated');
    };

    // Enhanced app installed handler
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Track successful installation
      updateMetrics({ installAccepted: installMetrics.installAccepted + 1 });
      
      // Observability: Log installation
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: 'App Installation Success'
        });
      }
    };

    // Service Worker update handler for "Nova versão disponível" toast
    const handleSWUpdate = () => {
      setHasUpdate(true);
      setUpdateAvailable(true);
      console.log('[PWA] Service Worker update available');
      
      // Show toast notification (you can integrate with your toast system)
      if (typeof window !== 'undefined' && window.__PWA_SW_UPDATE_AVAILABLE__) {
        // This would trigger your toast component
        window.dispatchEvent(new CustomEvent('pwa-update-available', {
          detail: { message: 'Nova versão disponível! Clique para atualizar.' }
        }));
      }
    };

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
    
    // Listen for Service Worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate);
      
      // Check for existing Service Worker updates
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          handleSWUpdate();
        }
      });
    }

    // Verificar estado inicial
    checkStandalone();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate);
      }
    };
  }, [updateMetrics, installMetrics]);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log('[PWA] Install prompt result:', result.outcome);
      
      setPromptOutcome(result.outcome);
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        updateMetrics({ installAccepted: installMetrics.installAccepted + 1 });
        
        // Observability: Log successful installation
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_install_accepted', {
            event_category: 'PWA',
            event_label: 'User Accepted Installation',
            value: 1
          });
        }
      } else {
        updateMetrics({ installDismissed: installMetrics.installDismissed + 1 });
        
        // Observability: Log dismissed installation
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_install_dismissed', {
            event_category: 'PWA',
            event_label: 'User Dismissed Installation'
          });
        }
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      
      // Observability: Log installation errors
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_install_error', {
          event_category: 'PWA',
          event_label: 'Installation Error',
          value: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

  const checkForUpdates = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('[PWA] Checked for updates');
          
          // Check if there's a waiting service worker
          if (registration.waiting) {
            setUpdateAvailable(true);
            setHasUpdate(true);
            
            // Trigger update available event
            window.dispatchEvent(new CustomEvent('pwa-update-available', {
              detail: { 
                message: 'Nova versão disponível! Clique para atualizar.',
                registration 
              }
            }));
          }
          
          // Observability: Log update check
          if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_update_check', {
              event_category: 'PWA',
              event_label: 'Manual Update Check',
              value: registration.waiting ? 1 : 0
            });
          }
        }
      } catch (error) {
        console.error('[PWA] Update check error:', error);
        
        // Observability: Log update errors
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'pwa_update_error', {
            event_category: 'PWA',
            event_label: 'Update Check Error'
          });
        }
      }
    }
  };

  // Apply update and reload
  const applyUpdate = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Listen for controlling to reload
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
          
          setUpdateAvailable(false);
          setHasUpdate(false);
        }
      } catch (error) {
        console.error('[PWA] Apply update error:', error);
      }
    }
  }, []);

  // Storage management
  const getStorageUsage = useCallback(async () => {
    try {
      const usage = await offlineStorage.getStorageUsage();
      setStorageUsage(usage);
      return usage;
    } catch (error) {
      console.error('[PWA] Failed to get storage usage:', error);
      return { used: 0, quota: 0, percentage: 0 };
    }
  }, []);

  // Clear offline data
  const clearOfflineData = useCallback(async () => {
    try {
      await offlineStorage.clearStore('appointments');
      await offlineStorage.clearStore('chat_messages');
      await offlineStorage.clearStore('user_data');
      
      console.log('[PWA] Offline data cleared');
      
      // Update storage usage
      await getStorageUsage();
      
      return true;
    } catch (error) {
      console.error('[PWA] Failed to clear offline data:', error);
      return false;
    }
  }, [getStorageUsage]);

  // Sync offline data manually
  const syncOfflineData = useCallback(async () => {
    if (!isOnline) {
      console.log('[PWA] Cannot sync offline - no network connection');
      return false;
    }

    try {
      setBackgroundSyncStatus('syncing');
      
      // Trigger background sync via Service Worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.sync) {
          await registration.sync.register('background-sync-appointments');
          await registration.sync.register('background-sync-chat');
        }
      }
      
      console.log('[PWA] Manual sync triggered');
      return true;
    } catch (error) {
      console.error('[PWA] Manual sync failed:', error);
      setBackgroundSyncStatus('failed');
      return false;
    }
  }, [isOnline]);

  // Get metrics and observability data
  const getMetrics = useCallback(async () => {
    const storage = await getStorageUsage();
    
    return {
      install: installMetrics,
      storage,
      online: isOnline,
      installed: isInstalled,
      standalone: isStandalone,
      updateAvailable,
      backgroundSyncStatus
    };
  }, [installMetrics, isOnline, isInstalled, isStandalone, updateAvailable, backgroundSyncStatus, getStorageUsage]);

  // Initialize storage monitoring
  useEffect(() => {
    getStorageUsage();
    
    // Update storage usage periodically
    const interval = setInterval(getStorageUsage, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [getStorageUsage]);

  // Listen for Service Worker sync events
  useEffect(() => {
    const handleSyncComplete = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        console.log('[PWA] Sync completed:', event.data.data);
        setBackgroundSyncStatus('idle');
        
        // Update storage usage after sync
        getStorageUsage();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSyncComplete);
    }
      
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSyncComplete);
      }
    };
  }, [getStorageUsage]);

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isOnline,
    prompt: deferredPrompt ? {
      prompt: installApp,
      outcome: promptOutcome
    } : null,
    installApp,
    checkForUpdates,
    hasUpdate,
    updateAvailable,
    backgroundSyncStatus,
    installMetrics,
    applyUpdate,
    storageUsage,
    getStorageUsage,
    clearOfflineData,
    syncOfflineData,
    getMetrics
  };
};
