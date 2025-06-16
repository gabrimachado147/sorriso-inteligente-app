
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

<<<<<<< HEAD
  // Get all contacts
  const {
    data: contacts = [],
=======
  // Use getClinics hook function - takes filters as parameters
  const useGetClinics = (filters?: {
    specialty?: string
    city?: string
    emergencyOnly?: boolean
    featured?: boolean
    search?: string
  }) => {
    return useQuery({
      queryKey: ['clinics', filters],
      queryFn: () => ClinicService.getAll(filters),
      staleTime: 5 * 60 * 1000 // 5 minutes
    })
  }

  // Get featured clinics
  const {
    data: featuredClinics = [],
    isLoading: isLoadingFeatured
  } = useQuery({
    queryKey: ['clinics', 'featured'],
    queryFn: () => ClinicService.getFeatured(6),
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  // Get emergency clinics
  const {
    data: emergencyClinics = [],
    isLoading: isLoadingEmergency
  } = useQuery({
    queryKey: ['clinics', 'emergency'],
    queryFn: () => ClinicService.getEmergencyAvailable(),
    staleTime: 5 * 60 * 1000
  })

  // Get specialties
  const {
    data: specialties = [],
    isLoading: isLoadingSpecialties
  } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => ClinicService.getSpecialties(),
    staleTime: 30 * 60 * 1000 // 30 minutes
  })

  // Get cities
  const {
    data: cities = [],
    isLoading: isLoadingCities
  } = useQuery({
    queryKey: ['cities'],
    queryFn: () => ClinicService.getCities(),
    staleTime: 30 * 60 * 1000
  })

  // Get clinic by ID hook function
  const useGetClinicById = (clinicId: string) => {
    return useQuery({
      queryKey: ['clinic', clinicId],
      queryFn: () => ClinicService.getById(clinicId),
      enabled: !!clinicId,
      staleTime: 10 * 60 * 1000
    })
  }

  // Search clinics
  const searchClinics = async (
    searchTerm: string,
    filters?: {
      specialty?: string
      city?: string
      emergency?: boolean
    }
  ): Promise<Clinic[]> => {
    return ClinicService.search(searchTerm, filters)
  }

  return {
    useGetClinics,
    featuredClinics,
    emergencyClinics,
    specialties,
    cities,
    isLoadingFeatured,
    isLoadingEmergency,
    isLoadingSpecialties,
    isLoadingCities,
    useGetClinicById,
    searchClinics
  }
}

// Hook for appointment statistics
export const useAppointmentStats = (userId?: string) => {
  const {
    data: stats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    },
>>>>>>> main
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

<<<<<<< HEAD
  return { realtimeMessages }
=======
  return { realtimeAppointments }
}

// Hook for clinic working hours
export const useClinicHours = (clinicId: string) => {
  const [isOpen, setIsOpen] = useState(false)
  const [nextOpenTime, setNextOpenTime] = useState<string>('')

  useEffect(() => {
    if (!clinicId) return

    const checkIfOpen = async () => {
      try {
        const isCurrentlyOpen = await ClinicService.isOpenNow(clinicId)
        setIsOpen(isCurrentlyOpen)

        // Get working hours for next few days to determine next open time
        const today = new Date()
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() + i)
          const dayName = days[checkDate.getDay()]
          
          const hours = await ClinicService.getWorkingHours(clinicId, dayName)
          if (hours) {
            const openDateTime = new Date(`${checkDate.toISOString().split('T')[0]}T${hours.open}`)
            if (openDateTime > new Date()) {
              setNextOpenTime(openDateTime.toLocaleString())
              break
            }
          }
        }
      } catch (error) {
        console.error('Error checking clinic hours:', error)
      }
    }

    checkIfOpen()
    
    // Check every minute
    const interval = setInterval(checkIfOpen, 60000)
    
    return () => clearInterval(interval)
  }, [clinicId])

  return { isOpen, nextOpenTime }
}

// Hook for managing user profile and PWA data
export const useUserProfile = (userId?: string) => {
  const queryClient = useQueryClient()

  // Get user profile
  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId
  })

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] })
    }
  })

  // Track PWA installation
  const trackPWAInstallation = useMutation({
    mutationFn: async (installData: {
      device_type?: string
      browser?: string
      platform?: string
      install_source?: string
    }) => {
      if (!userId) throw new Error('User ID required')
      
      // Generate a unique installation ID
      const installationId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const { data, error } = await supabase
        .from('pwa_installations')
        .insert({
          user_id: userId,
          installation_id: installationId,
          device_info: installData,
          ...installData
        })

      if (error) throw error
      return data
    }
  })

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    trackPWAInstallation
  }
>>>>>>> main
}
