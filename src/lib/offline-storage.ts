/**
 * Gerenciador de armazenamento offline usando IndexedDB
 * Para sincronização de dados quando offline
 */

export interface OfflineData {
  id: string;
  data: unknown;
  timestamp: number;
  token?: string;
  type: 'appointment' | 'chat_message' | 'user_data';
}

class OfflineStorageManager {
  private dbName = 'SorrisoInteligenteDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('[OfflineStorage] Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineStorage] Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('[OfflineStorage] Setting up database schema');

        // Store para agendamentos offline
        if (!db.objectStoreNames.contains('appointments')) {
          const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' });
          appointmentsStore.createIndex('timestamp', 'timestamp', { unique: false });
          appointmentsStore.createIndex('type', 'type', { unique: false });
        }

        // Store para mensagens do chat offline
        if (!db.objectStoreNames.contains('chat_messages')) {
          const messagesStore = db.createObjectStore('chat_messages', { keyPath: 'id' });
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false });
          messagesStore.createIndex('type', 'type', { unique: false });
        }

        // Store para dados do usuário offline
        if (!db.objectStoreNames.contains('user_data')) {
          const userStore = db.createObjectStore('user_data', { keyPath: 'id' });
          userStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para configurações PWA
        if (!db.objectStoreNames.contains('pwa_settings')) {
          const settingsStore = db.createObjectStore('pwa_settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveOfflineData(storeName: string, data: OfflineData): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put({
        ...data,
        timestamp: Date.now()
      });

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Saved data to ${storeName}:`, data.id);
        resolve();
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to save to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async getOfflineData(storeName: string): Promise<OfflineData[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to get data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async removeOfflineData(storeName: string, id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Removed data from ${storeName}:`, id);
        resolve();
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to remove from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async clearStore(storeName: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Cleared store: ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to clear ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async savePWASetting(key: string, value: unknown): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pwa_settings'], 'readwrite');
      const store = transaction.objectStore('pwa_settings');
      
      const request = store.put({
        key,
        value,
        timestamp: Date.now()
      });

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Saved PWA setting: ${key}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to save PWA setting:`, request.error);
        reject(request.error);
      };
    });
  }

  async getPWASetting(key: string): Promise<unknown> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pwa_settings'], 'readonly');
      const store = transaction.objectStore('pwa_settings');
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };

      request.onerror = () => {
        console.error(`[OfflineStorage] Failed to get PWA setting:`, request.error);
        reject(request.error);
      };
    });
  }

  async getStorageUsage(): Promise<{ used: number; quota: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;

        return { used, quota, percentage };
      } catch (error) {
        console.error('[OfflineStorage] Failed to get storage estimate:', error);
        return { used: 0, quota: 0, percentage: 0 };
      }
    }

    return { used: 0, quota: 0, percentage: 0 };
  }
}

// Instância singleton
export const offlineStorage = new OfflineStorageManager();

// Funções de conveniência
export const saveAppointmentOffline = async (appointment: unknown, token?: string): Promise<void> => {
  const data: OfflineData = {
    id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: appointment,
    timestamp: Date.now(),
    token,
    type: 'appointment'
  };
  
  await offlineStorage.saveOfflineData('appointments', data);
};

export const saveChatMessageOffline = async (message: unknown, token?: string): Promise<void> => {
  const data: OfflineData = {
    id: `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: message,
    timestamp: Date.now(),
    token,
    type: 'chat_message'
  };
  
  await offlineStorage.saveOfflineData('chat_messages', data);
};

export const getOfflineAppointments = async (): Promise<OfflineData[]> => {
  return offlineStorage.getOfflineData('appointments');
};

export const getOfflineChatMessages = async (): Promise<OfflineData[]> => {
  return offlineStorage.getOfflineData('chat_messages');
};

export const clearOfflineData = async (): Promise<void> => {
  await Promise.all([
    offlineStorage.clearStore('appointments'),
    offlineStorage.clearStore('chat_messages'),
    offlineStorage.clearStore('user_data')
  ]);
};

// Inicializar automaticamente
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(error => {
    console.error('[OfflineStorage] Failed to initialize:', error);
  });
}
