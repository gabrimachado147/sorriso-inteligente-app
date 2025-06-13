
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations, getStaggerStyle } from '@/lib/animations';
import { Star } from 'lucide-react';
import { ReviewSkeleton } from '@/components/ui/enhanced-skeleton';

interface ReviewsSectionProps {
  loading?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ loading = false }) => {
  const reviews = [
    {
      name: 'Maria Silva',
      rating: 5,
      comment: 'Excelente atendimento! A avaliação gratuita me surpreendeu pela qualidade.'
    },
    {
      name: 'João Santos', 
      rating: 5,
      comment: 'Equipe muito profissional e clínica moderna. Recomendo!'
    }
  ];

  return (
    <Card className={animations.slideInBottom}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className={`h-5 w-5 mr-2 text-yellow-500 ${animations.toothGlow}`} />
          Avaliações de Pacientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : (
            reviews.map((review, index) => (
              <div 
                key={review.name}
                className={`p-3 bg-gray-50 rounded-lg ${animations.cardHover}`}
                style={getStaggerStyle(index)}
              >
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(i => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 fill-current ${animations.iconHover}`} 
                        style={getStaggerStyle(i, 25)}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{review.name}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
