
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppointmentService, type AppointmentRecord, type CreateAppointmentData, type UpdateAppointmentData } from '@/services/supabase/appointments'
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

  // Update appointment service and price
  const updateAppointmentService = useMutation({
    mutationFn: async ({ 
      appointmentId, 
      service,
      price 
    }: { 
      appointmentId: string
      service: string
      price?: number
    }) => {
      return AppointmentService.updateAppointmentService(appointmentId, service, price)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toastSuccess('Serviço Atualizado', 'Serviço e valor atualizados com sucesso')
    },
    onError: (error) => {
      toastError('Erro', 'Não foi possível atualizar o serviço')
      console.error('Erro ao atualizar serviço:', error)
    }
  })

  // Update appointment data (comprehensive update)
  const updateAppointment = useMutation({
    mutationFn: async ({ 
      appointmentId, 
      updates 
    }: { 
      appointmentId: string
      updates: UpdateAppointmentData
    }) => {
      console.log('useAppointments: Updating appointment:', appointmentId, updates);
      return AppointmentService.updateAppointment(appointmentId, updates)
    },
    onSuccess: (updatedAppointment) => {
      console.log('useAppointments: Update successful:', updatedAppointment);
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toastSuccess('Agendamento Atualizado', 'Dados atualizados com sucesso')
    },
    onError: (error) => {
      console.error('useAppointments: Update error:', error);
      toastError('Erro', 'Não foi possível atualizar o agendamento')
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
    updateAppointmentService,
    updateAppointment,
    stats,
    statsLoading
  }
}
