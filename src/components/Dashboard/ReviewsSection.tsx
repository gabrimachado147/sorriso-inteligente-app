
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Star } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <Card className={animations.slideInBottom}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Avaliações de Pacientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`p-3 bg-gray-50 rounded-lg ${animations.cardHover}`}>
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="ml-2 font-medium">Maria Silva</span>
            </div>
            <p className="text-sm text-gray-600">
              "Excelente atendimento! A avaliação gratuita me surpreendeu pela qualidade."
            </p>
          </div>
          
          <div className={`p-3 bg-gray-50 rounded-lg ${animations.cardHover}`}>
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="ml-2 font-medium">João Santos</span>
            </div>
            <p className="text-sm text-gray-600">
              "Equipe muito profissional e clínica moderna. Recomendo!"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
