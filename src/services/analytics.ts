
import { supabase } from '@/integrations/supabase/client'

export interface DashboardStats {
  total_appointments: number
  pending_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  average_rating: number
  growth_percentage: number
}

export interface ChatConversionData {
  chatStarted: number
  appointmentsScheduled: number
  conversionRate: number
}

export interface AppointmentsByPeriod {
  id: string
  date: string
  status: string
  clinic_id: string
}

export class AnalyticsService {
  static async getDashboardStats(clinicId?: string): Promise<DashboardStats> {
    try {
      let query = supabase
        .from('appointments')
        .select('status')

      if (clinicId) {
        query = query.eq('clinic_id', clinicId)
      }

      const { data: appointments } = await query

      const total_appointments = appointments?.length || 0
      const pending_appointments = appointments?.filter(apt => apt.status === 'pending')?.length || 0
      const completed_appointments = appointments?.filter(apt => apt.status === 'completed')?.length || 0
      const cancelled_appointments = appointments?.filter(apt => apt.status === 'cancelled')?.length || 0

      // Calcular média de avaliações
      let avgQuery = supabase
        .from('reviews')
        .select('rating')

      if (clinicId) {
        avgQuery = avgQuery.eq('clinic_id', clinicId)
      }

      const { data: reviews } = await avgQuery
      const average_rating = reviews?.length 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
        : 0

      return {
        total_appointments,
        pending_appointments,
        completed_appointments,
        cancelled_appointments,
        average_rating,
        growth_percentage: 12.5 // Mock data por enquanto
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        total_appointments: 0,
        pending_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
        average_rating: 0,
        growth_percentage: 0
      }
    }
  }

  static async getChatConversionReport(clinicId?: string): Promise<ChatConversionData> {
    try {
      // Por enquanto retornando dados mock
      // Em produção, buscaria do analytics_events
      return {
        chatStarted: 45,
        appointmentsScheduled: 23,
        conversionRate: 51.1
      }
    } catch (error) {
      console.error('Error fetching chat conversion:', error)
      return {
        chatStarted: 0,
        appointmentsScheduled: 0,
        conversionRate: 0
      }
    }
  }

  static async getAppointmentsByPeriod(
    startDate: string, 
    endDate: string, 
    clinicId?: string
  ): Promise<AppointmentsByPeriod[]> {
    try {
      let query = supabase
        .from('appointments')
        .select('id, date, status, clinic_id')
        .gte('date', startDate)
        .lte('date', endDate)

      if (clinicId) {
        query = query.eq('clinic_id', clinicId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching appointments by period:', error)
      return []
    }
  }

  static async trackEvent(eventType: string, data: Record<string, any>, clinicId?: string) {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          clinic_id: clinicId,
          data
        })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }
}
