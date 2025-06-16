
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate subscriptions
    if (isSubscribedRef.current || channelRef.current) {
      return;
    }

    console.log('[RealtimeSync] Initializing realtime sync...');

    const setupChannel = () => {
      const channel = supabase
        .channel(`general-realtime-sync-${Date.now()}`) // Add timestamp to ensure unique channel name
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

      // Subscribe to the channel only once
      if (!isSubscribedRef.current) {
        channel.subscribe((status) => {
          console.log('[RealtimeSync] Subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('[RealtimeSync] Successfully connected to realtime sync');
            isSubscribedRef.current = true;
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[RealtimeSync] Failed to connect to realtime sync');
            isSubscribedRef.current = false;
          }
        });
      }
    };

    setupChannel();

    // Cleanup function
    return () => {
      console.log('[RealtimeSync] Cleaning up realtime sync...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [queryClient]);

  return {};
};
