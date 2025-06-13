
import { supabase } from '../../integrations/supabase/client'

export interface CreateAppointmentData {
  name: string
  phone: string
  email?: string
  service: string
  clinic: string
  date: string
  time: string
  webhook_session_id?: string
  notes?: string
}

export interface AppointmentRecord {
  id: string
  name: string
  phone: string
  email?: string
  service: string
  clinic: string
  date: string
  time: string
  status: string
  source: string
  webhook_session_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export class AppointmentService {
  /**
   * Criar um novo agendamento
   */
  static async createAppointment(data: CreateAppointmentData): Promise<AppointmentRecord> {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service,
        clinic: data.clinic,
        date: data.date,
        time: data.time,
        webhook_session_id: data.webhook_session_id,
        notes: data.notes,
        status: 'confirmed',
        source: 'webhook'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar agendamento:', error)
      throw new Error(`Erro ao criar agendamento: ${error.message}`)
    }

    return appointment
  }

  /**
   * Buscar agendamentos por telefone
   */
  static async getAppointmentsByPhone(phone: string): Promise<AppointmentRecord[]> {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`)
    }

    return appointments || []
  }

  /**
   * Buscar todos os agendamentos
   */
  static async getAllAppointments(): Promise<AppointmentRecord[]> {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar todos os agendamentos:', error)
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`)
    }

    return appointments || []
  }

  /**
   * Atualizar status do agendamento
   */
  static async updateAppointmentStatus(
    appointmentId: string, 
    status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  ): Promise<AppointmentRecord> {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar status:', error)
      throw new Error(`Erro ao atualizar status: ${error.message}`)
    }

    return appointment
  }

  /**
   * Estatísticas dos agendamentos
   */
  static async getAppointmentStats(): Promise<{
    total: number
    today: number
    confirmed: number
    cancelled: number
  }> {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('status, created_at')

    if (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
    }

    const today = new Date().toISOString().split('T')[0]
    const todayAppointments = appointments?.filter(apt => 
      apt.created_at.startsWith(today)
    ).length || 0

    const confirmedCount = appointments?.filter(apt => 
      apt.status === 'confirmed'
    ).length || 0

    const cancelledCount = appointments?.filter(apt => 
      apt.status === 'cancelled'
    ).length || 0

    return {
      total: appointments?.length || 0,
      today: todayAppointments,
      confirmed: confirmedCount,
      cancelled: cancelledCount
    }
  }
}
