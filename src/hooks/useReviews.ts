
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ReviewService, type Review, type ReviewStats } from '@/services/reviews'
import { toastSuccess, toastError } from '@/components/ui/custom-toast'

export const useReviews = (clinicId?: string) => {
  const queryClient = useQueryClient()

  // Buscar avaliações da clínica
  const {
    data: reviews = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['reviews', clinicId],
    queryFn: () => ReviewService.getClinicReviews(clinicId!),
    enabled: !!clinicId
  })

  // Buscar estatísticas de avaliações
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['review-stats', clinicId],
    queryFn: () => ReviewService.getClinicReviewStats(clinicId!),
    enabled: !!clinicId
  })

  // Criar nova avaliação
  const createReview = useMutation({
    mutationFn: ReviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-stats'] })
      toastSuccess('Avaliação enviada!', 'Obrigado pelo seu feedback')
    },
    onError: (error) => {
      toastError('Erro', 'Não foi possível enviar a avaliação')
      console.error('Error creating review:', error)
    }
  })

  return {
    reviews,
    stats,
    isLoading,
    statsLoading,
    error,
    createReview
  }
}

export const useCanReview = (appointmentId?: string, userId?: string) => {
  const [canReview, setCanReview] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!appointmentId || !userId) return

    const checkCanReview = async () => {
      setLoading(true)
      try {
        const result = await ReviewService.canUserReview(appointmentId, userId)
        setCanReview(result)
      } catch (error) {
        console.error('Error checking review permission:', error)
        setCanReview(false)
      } finally {
        setLoading(false)
      }
    }

    checkCanReview()
  }, [appointmentId, userId])

  return { canReview, loading }
}
