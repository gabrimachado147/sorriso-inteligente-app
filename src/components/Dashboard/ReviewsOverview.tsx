
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Star } from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'

interface ReviewsOverviewProps {
  clinicId?: string
}

export const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ clinicId }) => {
  const { reviews, stats, isLoading, statsLoading } = useReviews(clinicId)

  if (isLoading || statsLoading) {
    return <EnhancedSkeleton variant="card" />
  }

  const getRatingPercentage = (rating: number) => {
    if (!stats?.total_reviews) return 0
    return ((stats.rating_distribution[rating] || 0) / stats.total_reviews) * 100
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estatísticas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">{stats?.average_rating?.toFixed(1) || '0.0'}</span>
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
            </div>
            <p className="text-gray-600">{stats?.total_reviews || 0} avaliações</p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{rating}★</span>
                <Progress 
                  value={getRatingPercentage(rating)} 
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">
                  {stats?.rating_distribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avaliações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">
                      {review.user_profiles?.full_name || 'Usuário'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma avaliação ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
