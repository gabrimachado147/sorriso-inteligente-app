
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toastSuccess, toastInfo } from '@/components/ui/custom-toast';
import { usePushNotifications } from './usePushNotifications';
import type { AppointmentRecord } from '@/services/supabase/appointments';

export const useRealtimeAppointments = () => {
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const queryClient = useQueryClient();
  const { notifyNewAppointment } = usePushNotifications();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate subscriptions
    if (isSubscribedRef.current || channelRef.current) {
      return;
    }

    console.log('[Realtime] Setting up appointments real-time listener...');

    const setupChannel = () => {
      const channel = supabase
        .channel(`appointments-realtime-${Date.now()}`) // Add timestamp to ensure unique channel name
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'appointments'
          },
          (payload) => {
            console.log('[Realtime] New appointment created:', payload);
            
            const newAppointment = payload.new as AppointmentRecord;
            
            // Invalidate and refetch appointments
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
            
            // Show notification for chat-originated appointments
            if (newAppointment.source === 'webhook' || (newAppointment as any).webhook_session_id) {
              toastSuccess(
                'Novo Agendamento via Chat! 🎉',
                `${newAppointment.name} agendou para ${newAppointment.date} às ${newAppointment.time}`
              );
              
              // Notificação push
              notifyNewAppointment({
                name: newAppointment.name,
                date: newAppointment.date,
                time: newAppointment.time,
                clinic: newAppointment.clinic
              });
            } else {
              toastInfo(
                'Novo Agendamento',
                `${newAppointment.name} - ${newAppointment.service}`
              );
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments'
          },
          (payload) => {
            console.log('[Realtime] Appointment updated:', payload);
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'appointments'
          },
          (payload) => {
            console.log('[Realtime] Appointment deleted:', payload);
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
            
            toastInfo('Agendamento Removido', 'Um agendamento foi removido do sistema');
          }
        );

      // Store channel reference
      channelRef.current = channel;

      // Subscribe to the channel only once
      if (!isSubscribedRef.current) {
        channel.subscribe((status) => {
          console.log('[Realtime] Subscription status:', status);
          setRealtimeConnected(status === 'SUBSCRIBED');
          
          if (status === 'SUBSCRIBED') {
            console.log('[Realtime] Successfully connected to appointments updates');
            isSubscribedRef.current = true;
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[Realtime] Failed to connect to appointments updates');
            isSubscribedRef.current = false;
          }
        });
      }
    };

    setupChannel();

    // Cleanup function
    return () => {
      console.log('[Realtime] Cleaning up appointments subscription...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setRealtimeConnected(false);
      isSubscribedRef.current = false;
    };
  }, [queryClient, notifyNewAppointment]);

  return {
    realtimeConnected
  };
};
