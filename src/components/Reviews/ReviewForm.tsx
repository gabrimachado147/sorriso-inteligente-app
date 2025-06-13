
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'

interface ReviewFormProps {
  appointmentId: string
  clinicId: string
  userId: string
  onReviewSubmitted?: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  appointmentId,
  clinicId,
  userId,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const { createReview } = useReviews()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createReview.mutateAsync({
        appointment_id: appointmentId,
        clinic_id: clinicId,
        user_id: userId,
        rating,
        comment: comment.trim() || undefined
      })
      
      setComment('')
      setRating(5)
      onReviewSubmitted?.()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avalie sua consulta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Como você avalia o atendimento?</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {rating === 1 && 'Muito ruim'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Comentário (opcional)
            </label>
            <Textarea
              placeholder="Conte-nos sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createReview.isPending}
          >
            {createReview.isPending ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
