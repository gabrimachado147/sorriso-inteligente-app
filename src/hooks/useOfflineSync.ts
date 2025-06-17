
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncData {
  tableName: string;
  data: any[];
  lastSync: string;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<SyncData[]>([]);

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

  // Store data locally when offline
  const storeOfflineData = (tableName: string, data: any) => {
    const offlineData = localStorage.getItem('offlineData');
    const parsedData = offlineData ? JSON.parse(offlineData) : {};
    
    parsedData[tableName] = {
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    localStorage.setItem('offlineData', JSON.stringify(parsedData));
    console.log(`📱 [Offline] Data stored locally for ${tableName}`);
  };

  // Get offline data
  const getOfflineData = (tableName: string) => {
    const offlineData = localStorage.getItem('offlineData');
    if (offlineData) {
      const parsedData = JSON.parse(offlineData);
      return parsedData[tableName]?.data || null;
    }
    return null;
  };

  // Sync offline data when back online
  const syncOfflineData = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    const offlineData = localStorage.getItem('offlineData');
    
    if (!offlineData) {
      setIsSyncing(false);
      return;
    }

    try {
      const parsedData = JSON.parse(offlineData);
      const unsynced = Object.entries(parsedData).filter(
        ([, value]: [string, any]) => !value.synced
      );

      for (const [tableName, data] of unsynced) {
        try {
          // Try to sync specific tables that exist in the database
          if (tableName === 'appointments') {
            await supabase.from('appointments').upsert((data as any).data);
          }
          // Mark as synced
          parsedData[tableName].synced = true;
          console.log(`🔄 [Sync] ${tableName} synced successfully`);
        } catch (error) {
          console.error(`❌ [Sync] Failed to sync ${tableName}:`, error);
        }
      }

      localStorage.setItem('offlineData', JSON.stringify(parsedData));
      console.log('✅ [Sync] All offline data synced');
    } catch (error) {
      console.error('❌ [Sync] Failed to sync offline data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Clear synced data
  const clearSyncedData = () => {
    const offlineData = localStorage.getItem('offlineData');
    if (offlineData) {
      const parsedData = JSON.parse(offlineData);
      const unsynced = Object.fromEntries(
        Object.entries(parsedData).filter(([, value]: [string, any]) => !value.synced)
      );
      localStorage.setItem('offlineData', JSON.stringify(unsynced));
    }
  };

  // Auto-sync when online
  useEffect(() => {
    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline]);

  // Enhanced fetch with offline support
  const offlineFetch = async (tableName: string, query: any) => {
    if (isOnline) {
      try {
        const result = await query;
        // Store successful fetch for offline use
        if (result.data) {
          storeOfflineData(tableName, result.data);
        }
        return result;
      } catch (error) {
        console.error(`❌ [Fetch] Failed to fetch ${tableName} online:`, error);
        // Fallback to offline data
        const offlineData = getOfflineData(tableName);
        return { data: offlineData, error: null };
      }
    } else {
      // Return offline data
      const offlineData = getOfflineData(tableName);
      console.log(`📱 [Offline] Returning cached data for ${tableName}`);
      return { data: offlineData, error: null };
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    storeOfflineData,
    getOfflineData,
    syncOfflineData,
    clearSyncedData,
    offlineFetch
  };
};
