
// Serviço para sistema de avaliações
import { supabase } from '@/integrations/supabase/client'

export interface Review {
  id: string
  appointment_id: string
  user_id: string
  clinic_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: Record<number, number>
}

export class ReviewService {
  // Criar nova avaliação
  static async createReview(review: Omit<Review, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  }

  // Buscar avaliações de uma clínica
  static async getClinicReviews(clinicId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles(full_name)
        `)
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching clinic reviews:', error)
      throw error
    }
  }

  // Calcular estatísticas de avaliações
  static async getClinicReviewStats(clinicId: string): Promise<ReviewStats> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('clinic_id', clinicId)

      if (error) throw error

      const reviews = data || []
      const total_reviews = reviews.length
      
      if (total_reviews === 0) {
        return {
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: {}
        }
      }

      const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
      const average_rating = sum / total_reviews

      const rating_distribution = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1
        return acc
      }, {} as Record<number, number>)

      return {
        average_rating: Math.round(average_rating * 10) / 10,
        total_reviews,
        rating_distribution
      }
    } catch (error) {
      console.error('Error calculating review stats:', error)
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: {}
      }
    }
  }

  // Verificar se usuário pode avaliar
  static async canUserReview(appointmentId: string, userId: string) {
    try {
      // Verificar se o agendamento existe e pertence ao usuário
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select('status')
        .eq('id', appointmentId)
        .single()

      if (appointmentError || !appointment) return false

      // Verificar se já existe uma avaliação
      const { data: existingReview, error: reviewError } = await supabase
        .from('reviews')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('user_id', userId)
        .single()

      if (reviewError && reviewError.code !== 'PGRST116') throw reviewError

      // Pode avaliar se o agendamento foi concluído e não há avaliação existente
      return appointment.status === 'completed' && !existingReview
    } catch (error) {
      console.error('Error checking if user can review:', error)
      return false
    }
  }
}
