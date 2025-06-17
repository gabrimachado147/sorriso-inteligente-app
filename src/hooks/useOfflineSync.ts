import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OfflineData {
  id: string;
  table: string;
  data: any;
  action: 'insert' | 'update' | 'delete';
  timestamp: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 [Offline] Back online, starting sync...');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📴 [Offline] Gone offline, queuing operations...');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending sync data on mount
    loadPendingSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending sync data from localStorage
  const loadPendingSync = useCallback(() => {
    try {
      const stored = localStorage.getItem('offline-sync-queue');
      if (stored) {
        const parsed = JSON.parse(stored) as OfflineData[];
        setPendingSync(parsed);
        console.log(`📴 [Offline] Loaded ${parsed.length} pending operations`);
      }
    } catch (error) {
      console.error('❌ [Offline] Error loading pending sync data:', error);
    }
  }, []);

  // Save pending sync data to localStorage
  const savePendingSync = useCallback((data: OfflineData[]) => {
    try {
      localStorage.setItem('offline-sync-queue', JSON.stringify(data));
    } catch (error) {
      console.error('❌ [Offline] Error saving pending sync data:', error);
    }
  }, []);

  // Queue operation for offline sync
  const queueOperation = useCallback((table: string, data: any, action: 'insert' | 'update' | 'delete') => {
    const operation: OfflineData = {
      id: crypto.randomUUID(),
      table,
      data,
      action,
      timestamp: Date.now()
    };

    const updated = [...pendingSync, operation];
    setPendingSync(updated);
    savePendingSync(updated);
    
    console.log(`📴 [Offline] Queued ${action} operation for ${table}`, operation);
  }, [pendingSync, savePendingSync]);

  // Sync offline data when back online
  const syncOfflineData = useCallback(async () => {
    if (!isOnline || isSyncing || pendingSync.length === 0) {
      return;
    }

    setIsSyncing(true);
    console.log(`🔄 [Offline] Starting sync of ${pendingSync.length} operations...`);

    const successful: string[] = [];
    const failed: OfflineData[] = [];

    for (const operation of pendingSync) {
      try {
        let result;
        
        switch (operation.action) {
          case 'insert':
            result = await supabase
              .from(operation.table)
              .insert(operation.data);
            break;
          case 'update':
            result = await supabase
              .from(operation.table)
              .update(operation.data)
              .eq('id', operation.data.id);
            break;
          case 'delete':
            result = await supabase
              .from(operation.table)
              .delete()
              .eq('id', operation.data.id);
            break;
        }

        if (result.error) {
          throw result.error;
        }

        successful.push(operation.id);
        console.log(`✅ [Offline] Synced ${operation.action} for ${operation.table}`);
      } catch (error) {
        console.error(`❌ [Offline] Failed to sync ${operation.action} for ${operation.table}:`, error);
        failed.push(operation);
      }
    }

    // Update pending sync queue (keep only failed operations)
    setPendingSync(failed);
    savePendingSync(failed);

    setIsSyncing(false);
    console.log(`🔄 [Offline] Sync complete: ${successful.length} successful, ${failed.length} failed`);
  }, [isOnline, isSyncing, pendingSync, savePendingSync]);

  // Offline-aware database operation
  const offlineOperation = useCallback(async (
    table: string,
    data: any,
    action: 'insert' | 'update' | 'delete'
  ) => {
    if (isOnline) {
      try {
        let result;
        
        switch (action) {
          case 'insert':
            result = await supabase.from(table).insert(data);
            break;
          case 'update':
            result = await supabase.from(table).update(data).eq('id', data.id);
            break;
          case 'delete':
            result = await supabase.from(table).delete().eq('id', data.id);
            break;
        }

        if (result.error) {
          throw result.error;
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error(`❌ [Database] ${action} failed, queuing for offline sync:`, error);
        queueOperation(table, data, action);
        return { success: false, error, queued: true };
      }
    } else {
      queueOperation(table, data, action);
      return { success: false, queued: true, message: 'Operation queued for when online' };
    }
  }, [isOnline, queueOperation]);

  return {
    isOnline,
    pendingSync: pendingSync.length,
    isSyncing,
    queueOperation,
    syncOfflineData,
    offlineOperation
  };
};
