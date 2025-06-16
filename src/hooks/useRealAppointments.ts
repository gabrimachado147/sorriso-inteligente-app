
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RealAppointmentService, type RealAppointmentRecord, type CreateRealAppointmentData } from '@/services/supabase/realAppointments'
import { toastSuccess, toastError } from '@/components/ui/custom-toast'

export const useRealAppointments = (phone?: string) => {
  const queryClient = useQueryClient()

  // Buscar agendamentos reais do Supabase
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['real-appointments', phone],
    queryFn: async () => {
      console.log('useRealAppointments: Fetching appointments...');
      if (phone) {
        return RealAppointmentService.getAppointmentsByPhone(phone)
      }
      return RealAppointmentService.getAllAppointments()
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  })

  // Criar agendamento real
  const createAppointment = useMutation({
    mutationFn: async (data: CreateRealAppointmentData) => {
      console.log('useRealAppointments: Creating appointment with data:', data);
      return RealAppointmentService.createAppointment(data)
    },
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['real-appointments'] })
      toastSuccess(
        'Agendamento Criado!',
        `Consulta marcada para ${appointment.date} às ${appointment.time}`
      )
    },
    onError: (error) => {
      console.error('useRealAppointments: Error creating appointment:', error);
      toastError('Erro', 'Não foi possível criar o agendamento')
    }
  })

  // Atualizar status do agendamento
  const updateAppointmentStatus = useMutation({
    mutationFn: async ({ 
      appointmentId, 
      status 
    }: { 
      appointmentId: string
      status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
    }) => {
      return RealAppointmentService.updateAppointmentStatus(appointmentId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-appointments'] })
      toastSuccess('Status Atualizado', 'Agendamento atualizado com sucesso')
    },
    onError: (error) => {
      toastError('Erro', 'Não foi possível atualizar o status')
      console.error('Erro ao atualizar status:', error)
    }
  })

  // Buscar estatísticas reais
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['real-appointment-stats'],
    queryFn: () => RealAppointmentService.getAppointmentStats(),
    staleTime: 60000, // 1 minute
  })

  useEffect(() => {
    if (error) {
      console.error('useRealAppointments: Query error:', error);
    }
  }, [error]);

  return {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment,
    updateAppointmentStatus,
    stats,
    statsLoading
  }
}
