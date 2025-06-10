import { supabase } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type {
  Appointment,
  ChatMessage,
  Review,
  SyncQueueItem
} from './types'

export interface RealtimeError {
  message: string
  event?: string
  payload?: any
}

export interface RealtimeSubscription {
  channel: RealtimeChannel
  unsubscribe: () => void
}

// Subscribe to appointment updates for a specific user
export function subscribeToUserAppointments(
  userId: string,
  callbacks: {
    onInsert?: (appointment: Appointment) => void
    onUpdate?: (appointment: Appointment) => void
    onDelete?: (appointment: Appointment) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel(`user-appointments-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'appointments',
        filter: `patient_id=eq.${userId}`
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Appointment)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'appointments',
        filter: `patient_id=eq.${userId}`
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Appointment)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'appointments',
        filter: `patient_id=eq.${userId}`
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Appointment)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to appointments' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to dentist appointment updates
export function subscribeToDentistAppointments(
  dentistId: string,
  callbacks: {
    onInsert?: (appointment: Appointment) => void
    onUpdate?: (appointment: Appointment) => void
    onDelete?: (appointment: Appointment) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel(`dentist-appointments-${dentistId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'appointments',
        filter: `dentist_id=eq.${dentistId}`
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Appointment)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'appointments',
        filter: `dentist_id=eq.${dentistId}`
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Appointment)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'appointments',
        filter: `dentist_id=eq.${dentistId}`
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Appointment)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to dentist appointments' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to chat messages for a specific session
export function subscribeToChatMessages(
  sessionId: string,
  callbacks: {
    onInsert?: (message: ChatMessage) => void
    onUpdate?: (message: ChatMessage) => void
    onDelete?: (message: ChatMessage) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel(`chat-messages-${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as ChatMessage)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as ChatMessage)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as ChatMessage)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to chat messages' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to new reviews for a dentist or clinic
export function subscribeToReviews(
  targetType: 'dentist' | 'clinic',
  targetId: string,
  callbacks: {
    onInsert?: (review: Review) => void
    onUpdate?: (review: Review) => void
    onDelete?: (review: Review) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const filterColumn = targetType === 'dentist' ? 'dentist_id' : 'clinic_id'
  const channel = supabase
    .channel(`${targetType}-reviews-${targetId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews',
        filter: `${filterColumn}=eq.${targetId}`
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Review)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'reviews',
        filter: `${filterColumn}=eq.${targetId}`
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Review)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'reviews',
        filter: `${filterColumn}=eq.${targetId}`
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Review)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to reviews' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to sync queue updates for offline sync
export function subscribeToSyncQueue(
  userId: string | null,
  callbacks: {
    onInsert?: (item: SyncQueueItem) => void
    onUpdate?: (item: SyncQueueItem) => void
    onDelete?: (item: SyncQueueItem) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const filter = userId ? `user_id=eq.${userId}` : 'user_id=is.null'
  const channel = supabase
    .channel(`sync-queue-${userId || 'global'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sync_queue',
        filter
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as SyncQueueItem)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'sync_queue',
        filter
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as SyncQueueItem)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'sync_queue',
        filter
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as SyncQueueItem)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to sync queue' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to general table changes (for admin dashboard)
export function subscribeToTableChanges<T>(
  tableName: string,
  callbacks: {
    onInsert?: (record: T) => void
    onUpdate?: (record: T) => void
    onDelete?: (record: T) => void
    onError?: (error: RealtimeError) => void
  },
  filter?: string
): RealtimeSubscription {
  const channel = supabase
    .channel(`table-${tableName}-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: tableName,
        filter
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as T)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: tableName,
        filter
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as T)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: tableName,
        filter
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as T)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: `Failed to subscribe to ${tableName}` })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Presence for chat sessions (to show online users)
export function subscribeToPresence(
  channelName: string,
  userId: string,
  userMetadata: { name: string; avatar?: string },
  callbacks: {
    onJoin?: (user: any) => void
    onLeave?: (user: any) => void
    onSync?: () => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId
      }
    }
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      if (callbacks.onSync) {
        callbacks.onSync()
      }
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      if (callbacks.onJoin) {
        callbacks.onJoin({ key, presences: newPresences })
      }
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      if (callbacks.onLeave) {
        callbacks.onLeave({ key, presences: leftPresences })
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(userMetadata)
      } else if (callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to presence' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      channel.untrack()
      supabase.removeChannel(channel)
    }
  }
}

// Utility function to unsubscribe from all channels
export function unsubscribeFromAll(): void {
  supabase.removeAllChannels()
}
