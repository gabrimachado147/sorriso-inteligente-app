
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Star, Send } from 'lucide-react';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface FeedbackSystemProps {
  pageContext: string;
  onSubmit: (feedback: {
    rating: number;
    message: string;
    page: string;
  }) => void;
  className?: string;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  pageContext,
  onSubmit,
  className
}) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({
        rating,
        message,
        page: pageContext
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  if (submitted) {
    return (
      <Card className={cn('border-green-200 bg-green-50', animations.scaleInBounce, className)}>
        <CardContent className="p-4 text-center">
          <div className="text-green-600 mb-2">✓</div>
          <p className="text-green-800 font-medium">Obrigado pelo seu feedback!</p>
          <p className="text-green-600 text-sm">Sua opinião nos ajuda a melhorar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-blue-200 bg-blue-50', animations.fadeIn, className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MessageSquare className="h-5 w-5" />
          Feedback da Página
        </CardTitle>
        <p className="text-sm text-blue-700">{pageContext}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-blue-900">
            Como você avalia esta página?
          </Label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={cn(
                  'p-1 transition-colors duration-200',
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                )}
              >
                <Star className="h-5 w-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="feedback-message" className="text-sm font-medium text-blue-900">
            Comentários (opcional)
          </Label>
          <Textarea
            id="feedback-message"
            placeholder="Compartilhe sua experiência ou sugestões..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 border-blue-200 focus:border-blue-500"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Feedback
        </Button>
      </CardContent>
    </Card>
  );
};
