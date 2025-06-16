
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toastInfo } from '@/components/ui/custom-toast';

export const ReviewsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLeaveReview = () => {
    if (!isAuthenticated) {
      navigate('/profile');
      toastInfo('Login necessário', 'Faça login para deixar uma avaliação');
      return;
    }
    
    // Aqui você pode implementar a lógica para deixar avaliação
    toastInfo('Avaliação', 'Sistema de avaliações em desenvolvimento');
  };

  return (
    <Card className={animations.slideInLeft}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {isAuthenticated 
              ? 'Compartilhe sua experiência conosco' 
              : 'Faça login para compartilhar sua experiência'
            }
          </p>
          <Button 
            variant="outline"
            className={animations.buttonHover}
            onClick={handleLeaveReview}
          >
            {isAuthenticated ? 'Deixar Avaliação' : 'Fazer Login para Avaliar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
