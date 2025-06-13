
// Serviço para analytics e relatórios
import { supabase } from '@/integrations/supabase/client'

export interface AnalyticsEvent {
  id: string
  event_type: string
  clinic_id?: string
  user_id?: string
  data: Record<string, any>
  created_at: string
}

export interface DashboardStats {
  total_appointments: number
  pending_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  average_rating: number
  total_revenue: number
  growth_percentage: number
}

export class AnalyticsService {
  // Registrar evento de analytics
  static async trackEvent(
    eventType: string, 
    data: Record<string, any>, 
    clinicId?: string, 
    userId?: string
  ) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          clinic_id: clinicId,
          user_id: userId,
          data
        })

      if (error) throw error
    } catch (error) {
      console.error('Error tracking analytics event:', error)
    }
  }

  // Obter estatísticas do dashboard
  static async getDashboardStats(clinicId?: string): Promise<DashboardStats> {
    try {
      let query = supabase.from('appointments').select('*')
      
      if (clinicId) {
        query = query.eq('clinic', clinicId)
      }

      const { data: appointments, error } = await query

      if (error) throw error

      const total_appointments = appointments?.length || 0
      const pending_appointments = appointments?.filter(a => a.status === 'pending').length || 0
      const completed_appointments = appointments?.filter(a => a.status === 'completed').length || 0
      const cancelled_appointments = appointments?.filter(a => a.status === 'cancelled').length || 0

      // Calcular rating médio
      let average_rating = 0
      if (clinicId) {
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('clinic_id', clinicId)

        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
          average_rating = sum / reviews.length
        }
      }

      return {
        total_appointments,
        pending_appointments,
        completed_appointments,
        cancelled_appointments,
        average_rating: Math.round(average_rating * 10) / 10,
        total_revenue: 0, // Implementar cálculo de receita
        growth_percentage: 0 // Implementar cálculo de crescimento
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        total_appointments: 0,
        pending_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
        average_rating: 0,
        total_revenue: 0,
        growth_percentage: 0
      }
    }
  }

  // Obter relatório de conversão do chat
  static async getChatConversionReport(clinicId?: string) {
    try {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .in('event_type', ['chat_started', 'appointment_scheduled'])

      if (clinicId) {
        query = query.eq('clinic_id', clinicId)
      }

      const { data: events, error } = await query

      if (error) throw error

      const chatStarted = events?.filter(e => e.event_type === 'chat_started').length || 0
      const appointmentsScheduled = events?.filter(e => e.event_type === 'appointment_scheduled').length || 0

      const conversionRate = chatStarted > 0 ? (appointmentsScheduled / chatStarted) * 100 : 0

      return {
        chatStarted,
        appointmentsScheduled,
        conversionRate: Math.round(conversionRate * 10) / 10
      }
    } catch (error) {
      console.error('Error fetching chat conversion report:', error)
      return {
        chatStarted: 0,
        appointmentsScheduled: 0,
        conversionRate: 0
      }
    }
  }

  // Obter agendamentos por período
  static async getAppointmentsByPeriod(startDate: string, endDate: string, clinicId?: string) {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)

      if (clinicId) {
        query = query.eq('clinic', clinicId)
      }

      const { data, error } = await query.order('date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching appointments by period:', error)
      return []
    }
  }
}
