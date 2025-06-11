// React hooks for Supabase operations
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { AppointmentService } from '@/services/supabase/appointments'
import { ClinicService } from '@/services/supabase/clinics'
import type { 
  Appointment, 
  AppointmentInsert, 
  Clinic, 
  AppointmentStatus 
} from '@/integrations/supabase/types'

// Hook for managing user appointments
export const useAppointments = (userId?: string) => {
  const queryClient = useQueryClient()

  // Get user appointments
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => userId ? AppointmentService.getUserAppointments(userId) : [],
    enabled: !!userId
  })

  // Get upcoming appointments only
  const {
    data: upcomingAppointments = [],
    isLoading: isLoadingUpcoming
  } = useQuery({
    queryKey: ['appointments', userId, 'upcoming'],
    queryFn: () => 
      userId 
        ? AppointmentService.getUserAppointments(userId, { upcoming: true, limit: 5 })
        : [],
    enabled: !!userId
  })

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: (data: AppointmentInsert) => AppointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['clinics'] })
    }
  })

  // Update appointment mutation
  const updateAppointment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
      AppointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })

  // Cancel appointment mutation
  const cancelAppointment = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      AppointmentService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })

  // Confirm appointment mutation
  const confirmAppointment = useMutation({
    mutationFn: (id: string) => AppointmentService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })

  // Get available time slots
  const getAvailableSlots = async (
    clinicId: string,
    date: string,
    dentistId?: string,
    duration: number = 60
  ): Promise<string[]> => {
    return AppointmentService.getAvailableSlots(clinicId, date, dentistId, duration)
  }

  return {
    appointments,
    upcomingAppointments,
    isLoading,
    isLoadingUpcoming,
    error,
    refetch,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    getAvailableSlots
  }
}

// Hook for managing clinics
export const useClinics = () => {
  const queryClient = useQueryClient()

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
    isLoading,
    error
  } = useQuery({
    queryKey: ['appointment-stats', userId],
    queryFn: () => AppointmentService.getStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  })

  return { stats, isLoading, error }
}

// Hook for real-time appointment updates (optional)
export const useRealtimeAppointments = (userId?: string) => {
  const [realtimeAppointments, setRealtimeAppointments] = useState<Appointment[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`
        },
        (payload) => {
          console.log('Appointment update:', payload)
          
          // Invalidate and refetch appointment queries
          queryClient.invalidateQueries({ queryKey: ['appointments', userId] })
          
          // Update local state if needed
          if (payload.eventType === 'INSERT') {
            setRealtimeAppointments(prev => [...prev, payload.new as Appointment])
          } else if (payload.eventType === 'UPDATE') {
            setRealtimeAppointments(prev => 
              prev.map(apt => 
                apt.id === payload.new.id ? payload.new as Appointment : apt
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setRealtimeAppointments(prev => 
              prev.filter(apt => apt.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, queryClient])

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
    mutationFn: async (updates: Partial<any>) => {
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
}
