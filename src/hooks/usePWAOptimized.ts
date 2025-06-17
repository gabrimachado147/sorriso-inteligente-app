
import { useState, useEffect, useCallback } from 'react';
import { measurePerformance, memoize } from '@/utils/performance';

interface PWAOptimizedFeatures {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  installPrompt: (() => Promise<void>) | null;
  cacheStats: {
    size: number;
    hitRate: number;
    lastUpdated: Date | null;
  };
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    cacheEfficiency: number;
  };
  offlineCapabilities: {
    hasOfflineData: boolean;
    lastSync: Date | null;
    pendingSyncCount: number;
  };
  optimizePerformance: () => Promise<void>;
  clearCache: () => Promise<void>;
  syncOfflineData: () => Promise<void>;
}

// Memoized cache operations
const getCacheSize = memoize(async (): Promise<number> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalSize += keys.length;
    }
    
    return totalSize;
  }
  return 0;
});

const getStorageUsage = memoize(async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return await navigator.storage.estimate();
  }
  return { usage: 0, quota: 0 };
});

export const usePWAOptimized = (): PWAOptimizedFeatures => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<(() => Promise<void>) | null>(null);
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    hitRate: 0,
    lastUpdated: null as Date | null
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    cacheEfficiency: 0
  });
  const [offlineCapabilities, setOfflineCapabilities] = useState({
    hasOfflineData: false,
    lastSync: null as Date | null,
    pendingSyncCount: 0
  });

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkInstalled();
    window.addEventListener('appinstalled', () => setIsInstalled(true));
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
      
      const promptInstall = async () => {
        const beforeInstallPromptEvent = e as any;
        beforeInstallPromptEvent.prompt();
        const result = await beforeInstallPromptEvent.userChoice;
        
        if (result.outcome === 'accepted') {
          setCanInstall(false);
          setIsInstalled(true);
        }
      };
      
      setInstallPrompt(() => promptInstall);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update cache stats periodically
  useEffect(() => {
    const updateCacheStats = async () => {
      try {
        const size = await getCacheSize();
        const usage = await getStorageUsage();
        
        setCacheStats({
          size,
          hitRate: calculateCacheHitRate(),
          lastUpdated: new Date()
        });

        setPerformanceMetrics(prev => ({
          ...prev,
          cacheEfficiency: usage.usage && usage.quota ? 
            (usage.usage / usage.quota) * 100 : 0
        }));
      } catch (error) {
        console.error('Error updating cache stats:', error);
      }
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate cache hit rate (simplified)
  const calculateCacheHitRate = useCallback(() => {
    const hits = parseInt(localStorage.getItem('cache-hits') || '0');
    const misses = parseInt(localStorage.getItem('cache-misses') || '0');
    const total = hits + misses;
    
    return total > 0 ? (hits / total) * 100 : 0;
  }, []);

  // Performance optimization function
  const optimizePerformance = useCallback(async () => {
    await measurePerformance('PWA Optimization', async () => {
      try {
        // Clear old caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          const oldCaches = cacheNames.filter(name => 
            name.includes('old') || name.includes('v1')
          );
          
          await Promise.all(
            oldCaches.map(name => caches.delete(name))
          );
        }

        // Preload critical resources
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.update();
        }

        // Optimize IndexedDB
        await optimizeOfflineStorage();

        console.log('PWA performance optimization completed');
      } catch (error) {
        console.error('PWA optimization failed:', error);
      }
    });
  }, []);

  // Clear cache function
  const clearCache = useCallback(async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage (selective)
      const keysToKeep = ['user-preferences', 'auth-token'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      setCacheStats(prev => ({ ...prev, size: 0, lastUpdated: new Date() }));
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, []);

  // Sync offline data
  const syncOfflineData = useCallback(async () => {
    if (!isOnline) {
      console.log('Cannot sync - device is offline');
      return;
    }

    try {
      // Get offline data from IndexedDB
      const offlineData = await getOfflineData();
      
      if (offlineData.length > 0) {
        // Sync with server
        await Promise.all(
          offlineData.map(async (item: any) => {
            // Implement your sync logic here
            await syncDataItem(item);
          })
        );

        // Clear synced data
        await clearOfflineData();
        
        setOfflineCapabilities(prev => ({
          ...prev,
          lastSync: new Date(),
          pendingSyncCount: 0
        }));

        console.log(`Synced ${offlineData.length} offline items`);
      }
    } catch (error) {
      console.error('Offline sync failed:', error);
    }
  }, [isOnline]);

  return {
    isOnline,
    isInstalled,
    canInstall,
    installPrompt,
    cacheStats,
    performanceMetrics,
    offlineCapabilities,
    optimizePerformance,
    clearCache,
    syncOfflineData
  };
};

// Helper functions (implement based on your needs)
async function optimizeOfflineStorage(): Promise<void> {
  // Implement IndexedDB optimization
  console.log('Optimizing offline storage...');
}

async function getOfflineData(): Promise<any[]> {
  // Get data from IndexedDB
  return [];
}

async function syncDataItem(item: any): Promise<void> {
  // Sync individual item with server
  console.log('Syncing item:', item);
}

async function clearOfflineData(): Promise<void> {
  // Clear synced data from IndexedDB
  console.log('Clearing offline data...');
}
