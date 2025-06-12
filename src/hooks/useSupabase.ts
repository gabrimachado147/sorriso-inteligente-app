
// React hooks for Supabase operations - simplified for current schema
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

// Simple chat message interface based on existing schema
interface ChatMessage {
  id: number
  created_at: string
  phone: string | null
  user_message: string | null
  bot_message: string | null
  message_type: string | null
  active: boolean | null
  nomewpp: string | null
}

// Hook for managing chat messages
export const useChatMessages = (phone?: string) => {
  const queryClient = useQueryClient()

  // Get chat messages for a phone number
  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['chat_messages', phone],
    queryFn: async () => {
      if (!phone) return []
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('phone', phone)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!phone
  })

  // Create chat message mutation
  const createMessage = useMutation({
    mutationFn: async (message: {
      phone: string
      user_message?: string
      bot_message?: string
      message_type?: string
      nomewpp?: string
    }) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          phone: message.phone,
          user_message: message.user_message,
          bot_message: message.bot_message,
          message_type: message.message_type || 'general',
          nomewpp: message.nomewpp,
          active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_messages'] })
    }
  })

  return {
    messages,
    isLoading,
    error,
    refetch,
    createMessage
  }
}

// Hook for managing contacts
export const useContacts = () => {
  const queryClient = useQueryClient()

  // Get all contacts
  const {
    data: contacts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  // Create contact mutation
  const createContact = useMutation({
    mutationFn: async (contact: {
      nome: string
      email?: string
      telefone: string
      empresa?: string
      objetivo?: string
      click_id?: string
    }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          nome: contact.nome,
          email: contact.email,
          telefone: contact.telefone,
          empresa: contact.empresa,
          objetivo: contact.objetivo,
          click_id: contact.click_id,
          stage: 'incomplete',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  // Update contact mutation
  const updateContact = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string
      updates: Partial<{
        nome: string
        email: string
        telefone: string
        empresa: string
        objetivo: string
        stage: string
      }>
    }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  return {
    contacts,
    isLoading,
    error,
    createContact,
    updateContact
  }
}

// Hook for managing WhatsApp leads
export const useWhatsAppLeads = () => {
  const queryClient = useQueryClient()

  // Get leads from the senhor sorriso table
  const {
    data: leads = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['whatsapp_leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads_whatsapp_senhor_sorriso')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  // Create lead mutation
  const createLead = useMutation({
    mutationFn: async (lead: {
      name?: string
      lead_name?: string
      phone?: string
      number?: string
      thread_id?: string
      sessionId?: string
      Whastapp?: string
      chatInput?: string
    }) => {
      const { data, error } = await supabase
        .from('leads_whatsapp_senhor_sorriso')
        .insert({
          name: lead.name,
          lead_name: lead.lead_name,
          phone: lead.phone,
          number: lead.number,
          thread_id: lead.thread_id,
          sessionId: lead.sessionId,
          Whastapp: lead.Whastapp,
          chatInput: lead.chatInput,
          data_de_cadastro: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_leads'] })
    }
  })

  return {
    leads,
    isLoading,
    error,
    createLead
  }
}

// Hook for real-time chat updates
export const useRealtimeChat = (phone?: string) => {
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!phone) return

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `phone=eq.${phone}`
        },
        (payload) => {
          console.log('Chat message update:', payload)
          
          // Invalidate and refetch chat queries
          queryClient.invalidateQueries({ queryKey: ['chat_messages', phone] })
          
          // Update local state if needed
          if (payload.eventType === 'INSERT') {
            setRealtimeMessages(prev => [...prev, payload.new as ChatMessage])
          } else if (payload.eventType === 'UPDATE') {
            setRealtimeMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ChatMessage : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setRealtimeMessages(prev => 
              prev.filter(msg => msg.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [phone, queryClient])

  return { realtimeMessages }
}
