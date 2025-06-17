
import { PRODUCTION_CONFIG } from '@/config/production';
import { errorTracker } from '@/services/errorTracking';

interface UpdateEvent {
  type: 'update_available' | 'update_installed' | 'update_error';
  message: string;
  data?: any;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: ((event: UpdateEvent) => void)[] = [];

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !PRODUCTION_CONFIG.PWA_ENABLED) {
      console.warn('Service Worker not supported or PWA disabled');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker registered successfully');
      
      // Setup update listeners
      this.setupUpdateListeners();
      
      // Check for updates periodically
      this.setupPeriodicUpdateCheck();
      
      return true;
    } catch (error) {
      errorTracker.reportError(error as Error, {
        component: 'ServiceWorkerManager',
        action: 'initialize'
      });
      return false;
    }
  }

  private setupUpdateListeners() {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update available
            this.notifyUpdateCallbacks({
              type: 'update_available',
              message: 'Nova versão disponível! Clique para atualizar.'
            });
          } else {
            // First time installation
            this.notifyUpdateCallbacks({
              type: 'update_installed',
              message: 'App instalado e pronto para uso offline!'
            });
          }
        }
      });
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        this.notifyUpdateCallbacks({
          type: 'update_available',
          message: 'Novos dados em cache disponíveis!',
          data: event.data
        });
      }
    });
  }

  private setupPeriodicUpdateCheck() {
    // Check for updates every 30 minutes
    setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);

    // Check for updates when app becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('🔄 Checked for Service Worker updates');
    } catch (error) {
      console.warn('Failed to check for updates:', error);
    }
  }

  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) return;

    try {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Wait for the new service worker to take control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } catch (error) {
      errorTracker.reportError(error as Error, {
        component: 'ServiceWorkerManager',
        action: 'skipWaiting'
      });
    }
  }

  onUpdate(callback: (event: UpdateEvent) => void): () => void {
    this.updateCallbacks.push(callback);
    
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyUpdateCallbacks(event: UpdateEvent) {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  async getCacheStatus(): Promise<{ size: number; lastUpdate: string }> {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;
      let lastUpdate = new Date(0).toISOString();

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
            
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const responseDate = new Date(dateHeader).toISOString();
              if (responseDate > lastUpdate) {
                lastUpdate = responseDate;
              }
            }
          }
        }
      }

      return {
        size: totalSize,
        lastUpdate: lastUpdate || new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get cache status:', error);
      return { size: 0, lastUpdate: new Date().toISOString() };
    }
  }

  async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ Cache cleared');
    } catch (error) {
      errorTracker.reportError(error as Error, {
        component: 'ServiceWorkerManager',
        action: 'clearCache'
      });
    }
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();
