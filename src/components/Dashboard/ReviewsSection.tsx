
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import { animations } from '@/lib/animations';

export const ReviewsSection: React.FC = () => {
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
          <p className="text-gray-600 mb-4">Compartilhe sua experiência conosco</p>
          <Button 
            variant="outline"
            className={animations.buttonHover}
          >
            Deixar Avaliação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
