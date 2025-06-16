
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    console.log('[RealtimeSync] Initializing realtime sync...');

    // Clean up existing channel if it exists
    if (channelRef.current) {
      console.log('[RealtimeSync] Cleaning up existing channel...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel('general-realtime-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('[RealtimeSync] Appointment change detected:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
          queryClient.invalidateQueries({ queryKey: ['user-appointments'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('[RealtimeSync] Profile change detected:', payload);
          
          // Invalidate profile queries
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        }
      );

    // Store channel reference
    channelRef.current = channel;

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('[RealtimeSync] Subscription status:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('[RealtimeSync] Successfully connected to realtime sync');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[RealtimeSync] Failed to connect to realtime sync');
      }
    });

    // Cleanup function
    return () => {
      console.log('[RealtimeSync] Cleaning up realtime sync...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  return {};
};
