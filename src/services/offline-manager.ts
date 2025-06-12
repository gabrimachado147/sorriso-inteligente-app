// Advanced offline storage and sync service for PWA
export interface OfflineData {
  id: string;
  type: 'appointment' | 'user_data' | 'clinic_info' | 'chat_message';
  data: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data: Record<string, unknown>;
  headers?: Record<string, string>;
  retryCount: number;
  maxRetries: number;
  timestamp: number;
}

class PWAOfflineManager {
  private static instance: PWAOfflineManager;
  private dbName = 'SorrisoInteligente';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private syncQueue: SyncQueueItem[] = [];
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  private constructor() {
    this.initializeDB();
    this.setupNetworkListeners();
    this.setupPeriodicSync();
  }

  static getInstance(): PWAOfflineManager {
    if (!PWAOfflineManager.instance) {
      PWAOfflineManager.instance = new PWAOfflineManager();
    }
    return PWAOfflineManager.instance;
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[PWA] Offline database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for offline data
        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineStore = db.createObjectStore('offlineData', { keyPath: 'id' });
          offlineStore.createIndex('type', 'type', { unique: false });
          offlineStore.createIndex('timestamp', 'timestamp', { unique: false });
          offlineStore.createIndex('synced', 'synced', { unique: false });
        }

        // Store for sync queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('retryCount', 'retryCount', { unique: false });
        }

        // Store for cached responses
        if (!db.objectStoreNames.contains('apiCache')) {
          const cacheStore = db.createObjectStore('apiCache', { keyPath: 'url' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
          cacheStore.createIndex('expiry', 'expiry', { unique: false });
        }

        console.log('[PWA] Database schema updated');
      };
    });
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('[PWA] Network: Online');
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Network: Offline');
      this.isOnline = false;
    });
  }

  private setupPeriodicSync(): void {
    // Attempt sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.processSyncQueue();
      }
    }, 30000);
  }

  // Store data offline
  async storeOfflineData(data: Omit<OfflineData, 'id' | 'timestamp' | 'synced'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `${data.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineData: OfflineData = {
      id,
      timestamp: Date.now(),
      synced: false,
      ...data
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.add(offlineData);

      request.onsuccess = () => {
        console.log('[PWA] Data stored offline:', id);
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get offline data by type
  async getOfflineData(type?: string): Promise<OfflineData[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      
      let request: IDBRequest;
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Add item to sync queue
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const syncItem: SyncQueueItem = {
      id,
      timestamp: Date.now(),
      retryCount: 0,
      ...item,
      maxRetries: item.maxRetries || 3
    };

    this.syncQueue.push(syncItem);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.add(syncItem);

      request.onsuccess = () => {
        console.log('[PWA] Added to sync queue:', id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Process sync queue
  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    console.log('[PWA] Processing sync queue...');

    try {
      const queueItems = await this.getSyncQueue();
      
      for (const item of queueItems) {
        try {
          await this.syncItem(item);
          await this.removeSyncItem(item.id);
        } catch (error) {
          console.error('[PWA] Sync failed for item:', item.id, error);
          await this.incrementRetryCount(item);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const response = await fetch(item.endpoint, {
      method: item.method,
      headers: {
        'Content-Type': 'application/json',
        ...item.headers
      },
      body: ['POST', 'PUT', 'PATCH'].includes(item.method) ? JSON.stringify(item.data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    console.log('[PWA] Sync successful:', item.id);
  }

  private async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(['syncQueue'], 'readonly');
      if (!transaction) {
        reject(new Error('Failed to create transaction'));
        return;
      }
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result.filter((item: SyncQueueItem) => 
          item.retryCount < item.maxRetries
        );
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async removeSyncItem(id: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async incrementRetryCount(item: SyncQueueItem): Promise<void> {
    if (!this.db) return;

    const updatedItem = { ...item, retryCount: item.retryCount + 1 };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(updatedItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cache API responses
  async cacheAPIResponse(url: string, data: Record<string, unknown>, ttl: number = 3600000): Promise<void> {
    if (!this.db) return;

    const cacheItem = {
      url,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['apiCache'], 'readwrite');
      const store = transaction.objectStore('apiCache');
      const request = store.put(cacheItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached API response
  async getCachedAPIResponse(url: string): Promise<Record<string, unknown> | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['apiCache'], 'readonly');
      const store = transaction.objectStore('apiCache');
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiry > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Store appointment offline
  async storeAppointmentOffline(appointmentData: Record<string, unknown>): Promise<string> {
    const id = await this.storeOfflineData({
      type: 'appointment',
      data: appointmentData,
      priority: 'high'
    });

    // Add to sync queue
    await this.addToSyncQueue({
      endpoint: '/api/appointments',
      method: 'POST',
      data: appointmentData,
      maxRetries: 5
    });

    return id;
  }

  // Get offline appointments
  async getOfflineAppointments(): Promise<OfflineData[]> {
    return this.getOfflineData('appointment');
  }

  // Clean up old data
  async cleanupOldData(maxAge: number = 7 * 24 * 3600000): Promise<void> {
    if (!this.db) return;

    const cutoff = Date.now() - maxAge;

    // Clean offline data
    const transaction = this.db.transaction(['offlineData', 'apiCache'], 'readwrite');
    
    const offlineStore = transaction.objectStore('offlineData');
    const offlineIndex = offlineStore.index('timestamp');
    const offlineRequest = offlineIndex.openCursor(IDBKeyRange.upperBound(cutoff));

    offlineRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Clean expired cache
    const cacheStore = transaction.objectStore('apiCache');
    const cacheIndex = cacheStore.index('expiry');
    const cacheRequest = cacheIndex.openCursor(IDBKeyRange.upperBound(Date.now()));

    cacheRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    console.log('[PWA] Cleaned up old offline data');
  }

  // Get storage stats
  async getStorageStats(): Promise<{
    offlineItems: number;
    syncQueueSize: number;
    cacheSize: number;
    estimatedSize: number;
  }> {
    if (!this.db) return { offlineItems: 0, syncQueueSize: 0, cacheSize: 0, estimatedSize: 0 };

    const transaction = this.db.transaction(['offlineData', 'syncQueue', 'apiCache'], 'readonly');
    
    const offlineData = await new Promise<OfflineData[]>((resolve) => {
      const store = transaction.objectStore('offlineData');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    const syncQueue = await new Promise<SyncQueueItem[]>((resolve) => {
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    const cache = await new Promise<Record<string, unknown>[]>((resolve) => {
      const store = transaction.objectStore('apiCache');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    // Estimate storage size (rough calculation)
    const estimatedSize = 
      JSON.stringify(offlineData).length + 
      JSON.stringify(syncQueue).length + 
      JSON.stringify(cache).length;

    return {
      offlineItems: offlineData.length,
      syncQueueSize: syncQueue.length,
      cacheSize: cache.length,
      estimatedSize
    };
  }
}

// Hook for using offline manager
export const useOfflineManager = () => {
  const manager = PWAOfflineManager.getInstance();

  return {
    storeOfflineData: (data: Omit<OfflineData, 'id' | 'timestamp' | 'synced'>) => 
      manager.storeOfflineData(data),
    getOfflineData: (type?: string) => manager.getOfflineData(type),
    storeAppointmentOffline: (data: Record<string, unknown>) => manager.storeAppointmentOffline(data),
    getOfflineAppointments: () => manager.getOfflineAppointments(),
    cacheAPIResponse: (url: string, data: Record<string, unknown>, ttl?: number) => 
      manager.cacheAPIResponse(url, data, ttl),
    getCachedAPIResponse: (url: string) => manager.getCachedAPIResponse(url),
    getStorageStats: () => manager.getStorageStats(),
    cleanupOldData: (maxAge?: number) => manager.cleanupOldData(maxAge)
  };
};

export default PWAOfflineManager;
