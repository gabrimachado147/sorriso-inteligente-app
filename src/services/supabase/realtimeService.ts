
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeCallback<T> = (payload: T) => void;

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to appointment changes
  static subscribeToAppointments(callbacks: {
    onInsert?: RealtimeCallback<any>;
    onUpdate?: RealtimeCallback<any>;
    onDelete?: RealtimeCallback<any>;
  }): () => void {
    const channelName = 'appointments-realtime';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('New appointment:', payload);
          callbacks.onInsert?.(payload);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Updated appointment:', payload);
          callbacks.onUpdate?.(payload);
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Deleted appointment:', payload);
          callbacks.onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  // Subscribe to patient profile changes
  static subscribeToPatients(callbacks: {
    onInsert?: RealtimeCallback<any>;
    onUpdate?: RealtimeCallback<any>;
  }): () => void {
    const channelName = 'patients-realtime';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('New patient:', payload);
          callbacks.onInsert?.(payload);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('Updated patient:', payload);
          callbacks.onUpdate?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  // Subscribe to general notifications
  static subscribeToNotifications(
    channel: string,
    callback: (message: string) => void
  ): () => void {
    const channelName = `notifications-${channel}`;
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const realtimeChannel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'notification' }, (payload) => {
        callback(payload.message);
      })
      .subscribe();

    this.channels.set(channelName, realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  // Cleanup all channels
  static cleanup(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}
