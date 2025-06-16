
import { supabase } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from './types'

export interface RealtimeError {
  message: string
  event?: string
  payload?: Record<string, unknown>
}

export interface RealtimeSubscription {
  channel: RealtimeChannel
  unsubscribe: () => void
}

// Subscribe to chat messages for a specific phone number
export function subscribeToChatMessages(
  phone: string,
  callbacks: {
    onInsert?: (message: Tables<'chat_messages'>) => void
    onUpdate?: (message: Tables<'chat_messages'>) => void
    onDelete?: (message: Tables<'chat_messages'>) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel(`chat-messages-${phone}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `phone=eq.${phone}`
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Tables<'chat_messages'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `phone=eq.${phone}`
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Tables<'chat_messages'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_messages',
        filter: `phone=eq.${phone}`
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Tables<'chat_messages'>)
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

// Subscribe to contact updates
export function subscribeToContacts(
  callbacks: {
    onInsert?: (contact: Tables<'contacts'>) => void
    onUpdate?: (contact: Tables<'contacts'>) => void
    onDelete?: (contact: Tables<'contacts'>) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel('contacts-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'contacts'
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Tables<'contacts'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'contacts'
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Tables<'contacts'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'contacts'
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Tables<'contacts'>)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to contacts' })
      }
    })

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel)
    }
  }
}

// Subscribe to WhatsApp leads updates
export function subscribeToWhatsAppLeads(
  callbacks: {
    onInsert?: (lead: Tables<'leads_whatsapp_senhor_sorriso'>) => void
    onUpdate?: (lead: Tables<'leads_whatsapp_senhor_sorriso'>) => void
    onDelete?: (lead: Tables<'leads_whatsapp_senhor_sorriso'>) => void
    onError?: (error: RealtimeError) => void
  }
): RealtimeSubscription {
  const channel = supabase
    .channel('whatsapp-leads-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'leads_whatsapp_senhor_sorriso'
      },
      (payload) => {
        if (callbacks.onInsert) {
          callbacks.onInsert(payload.new as Tables<'leads_whatsapp_senhor_sorriso'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'leads_whatsapp_senhor_sorriso'
      },
      (payload) => {
        if (callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as Tables<'leads_whatsapp_senhor_sorriso'>)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'leads_whatsapp_senhor_sorriso'
      },
      (payload) => {
        if (callbacks.onDelete) {
          callbacks.onDelete(payload.old as Tables<'leads_whatsapp_senhor_sorriso'>)
        }
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED' && callbacks.onError) {
        callbacks.onError({ message: 'Failed to subscribe to WhatsApp leads' })
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
    onJoin?: (user: Record<string, unknown>) => void
    onLeave?: (user: Record<string, unknown>) => void
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
