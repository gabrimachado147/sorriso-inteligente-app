
import { useEffect, useState } from 'react';
import { realtimeSyncService } from '@/services/realtime-sync';
import { useAuth } from './useAuth';

interface RealtimeSyncState {
  isConnected: boolean;
  lastSync: Date | null;
  error: string | null;
}

export const useRealtimeSync = () => {
  const { isAuthenticated } = useAuth();
  const [syncState, setSyncState] = useState<RealtimeSyncState>({
    isConnected: false,
    lastSync: null,
    error: null
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const initializeSync = async () => {
      try {
        await realtimeSyncService.initializeSync({
          enableAppointments: true,
          enableUserProfiles: true,
          enableNotifications: true
        });

        setSyncState(prev => ({
          ...prev,
          isConnected: true,
          error: null
        }));

        console.log('[Realtime] Sync initialized');
      } catch (error) {
        console.error('[Realtime] Failed to initialize sync:', error);
        setSyncState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Sync failed'
        }));
      }
    };

    initializeSync();

    // Listen for sync events
    const handleAppointmentUpdate = () => {
      setSyncState(prev => ({ ...prev, lastSync: new Date() }));
    };

    const handleProfileUpdate = () => {
      setSyncState(prev => ({ ...prev, lastSync: new Date() }));
    };

    window.addEventListener('appointment-updated', handleAppointmentUpdate);
    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('appointment-updated', handleAppointmentUpdate);
      window.removeEventListener('profile-updated', handleProfileUpdate);
      realtimeSyncService.cleanup();
    };
  }, [isAuthenticated]);

  const triggerSync = async () => {
    try {
      await realtimeSyncService.syncOfflineData();
      setSyncState(prev => ({ ...prev, lastSync: new Date(), error: null }));
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sync failed'
      }));
    }
  };

  return {
    ...syncState,
    triggerSync
  };
};
