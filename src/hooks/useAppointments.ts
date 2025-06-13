
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppointmentService, type AppointmentRecord, type CreateAppointmentData } from '@/services/supabase/appointments'
import { toastSuccess, toastError } from '@/components/ui/custom-toast'

export const useAppointments = (phone?: string) => {
  const queryClient = useQueryClient()

  // Buscar agendamentos
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', phone],
    queryFn: async () => {
      if (phone) {
        return AppointmentService.getAppointmentsByPhone(phone)
      }
      return AppointmentService.getAllAppointments()
    }
  })

  // Criar agendamento
  const createAppointment = useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      return AppointmentService.createAppointment(data)
    },
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toastSuccess(
        'Agendamento Criado!',
        `Consulta marcada para ${appointment.date} às ${appointment.time}`
      )
    },
    onError: (error) => {
      toastError('Erro', 'Não foi possível criar o agendamento')
      console.error('Erro ao criar agendamento:', error)
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
      return AppointmentService.updateAppointmentStatus(appointmentId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toastSuccess('Status Atualizado', 'Agendamento atualizado com sucesso')
    },
    onError: (error) => {
      toastError('Erro', 'Não foi possível atualizar o status')
      console.error('Erro ao atualizar status:', error)
    }
  })

  // Buscar estatísticas
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['appointment-stats'],
    queryFn: () => AppointmentService.getAppointmentStats()
  })

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
