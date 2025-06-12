import { useState, useEffect } from 'react';

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
}

export const usePWA = (): PWAHook => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [promptOutcome, setPromptOutcome] = useState<'accepted' | 'dismissed' | null>(null);

  useEffect(() => {
    // Verificar se é standalone (já instalado)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone ||
                              document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };

    // Listener para evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('[PWA] App is installable');
    };

    // Listener para mudanças no status online/offline
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(navigator.onLine);

    // Listener para app instalado
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    // Verificar estado inicial
    checkStandalone();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    try {
      const result = await deferredPrompt.prompt();
      console.log('[PWA] Install prompt result:', result.outcome);
      
      setPromptOutcome(result.outcome);
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
    }
  };

  const checkForUpdates = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('[PWA] Checked for updates');
        }
      } catch (error) {
        console.error('[PWA] Update check error:', error);
      }
    }
  };

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
    checkForUpdates
  };
};
