
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarService } from '@/services/calendar'
import { toastSuccess, toastError } from '@/components/ui/custom-toast'

export const useCalendar = () => {
  const queryClient = useQueryClient()

  // Conectar com Google Calendar
  const connectGoogle = useMutation({
    mutationFn: CalendarService.connectGoogleCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] })
      toastSuccess('Conectado!', 'Google Calendar conectado com sucesso')
    },
    onError: () => {
      toastError('Erro', 'Não foi possível conectar com o Google Calendar')
    }
  })

  // Conectar com Apple Calendar
  const connectApple = useMutation({
    mutationFn: CalendarService.connectAppleCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] })
      toastSuccess('Conectado!', 'Apple Calendar conectado com sucesso')
    },
    onError: () => {
      toastError('Erro', 'Não foi possível conectar com o Apple Calendar')
    }
  })

  // Sincronizar agendamento
  const syncAppointment = useMutation({
    mutationFn: ({ appointment, userId }: { appointment: any, userId: string }) =>
      CalendarService.syncAppointmentToCalendar(appointment, userId),
    onSuccess: () => {
      toastSuccess('Sincronizado!', 'Agendamento adicionado ao seu calendário')
    },
    onError: () => {
      toastError('Erro', 'Não foi possível sincronizar com o calendário')
    }
  })

  return {
    connectGoogle,
    connectApple,
    syncAppointment
  }
}
