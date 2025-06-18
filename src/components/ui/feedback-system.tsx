
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InteractiveFeedback } from './interactive-feedback';

interface FeedbackSystemProps {
  pageContext: string;
  onSubmit?: (feedback: FeedbackData) => void;
  className?: string;
}

interface FeedbackData {
  rating: number;
  feedback: string;
  recommendation: boolean;
  pageContext: string;
  timestamp: string;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  pageContext,
  onSubmit,
  className
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recommendation, setRecommendation] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive"
      });
      return;
    }

    const feedbackData: FeedbackData = {
      rating,
      feedback,
      recommendation: recommendation ?? false,
      pageContext,
      timestamp: new Date().toISOString()
    };

    // Salvar no localStorage para análise
    const existingFeedback = JSON.parse(localStorage.getItem('page_feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('page_feedback', JSON.stringify(existingFeedback));

    onSubmit?.(feedbackData);
    setSubmitted(true);

    toast({
      title: "Feedback enviado!",
      description: "Obrigado por nos ajudar a melhorar sua experiência.",
    });
  };

  if (submitted) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4 text-center">
          <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-700 font-medium">Obrigado pelo seu feedback!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Como foi sua experiência?
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {pageContext}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avaliação por estrelas */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Avalie sua experiência:
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <InteractiveFeedback key={star} feedbackType="scale">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </Button>
              </InteractiveFeedback>
            ))}
          </div>
        </div>

        {/* Recomendação */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Você recomendaria esta página?
          </label>
          <div className="flex gap-2">
            <InteractiveFeedback feedbackType="scale">
              <Button
                variant={recommendation === true ? "default" : "outline"}
                size="sm"
                onClick={() => setRecommendation(true)}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Sim
              </Button>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="scale">
              <Button
                variant={recommendation === false ? "default" : "outline"}
                size="sm"
                onClick={() => setRecommendation(false)}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Não
              </Button>
            </InteractiveFeedback>
          </div>
        </div>

        {/* Comentários */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Comentários (opcional):
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Compartilhe sua experiência ou sugestões de melhoria..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <InteractiveFeedback feedbackType="scale">
          <Button onClick={handleSubmit} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Enviar Feedback
          </Button>
        </InteractiveFeedback>
      </CardContent>
    </Card>
  );
};
