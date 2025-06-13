
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Calendar, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onScheduleEvaluation: () => void;
  onViewUnits: () => void;
  schedulingLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScheduleEvaluation,
  onViewUnits,
  schedulingLoading
}) => {
  return (
    <Card className={`bg-gradient-to-r from-primary to-blue-600 text-white ${animations.fadeIn}`}>
      <CardContent className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Senhor Sorriso</h1>
          <p className="text-sm sm:text-base mb-4 opacity-90 px-4">
            Cuidando do seu sorriso com carinho e profissionalismo. 
            Agendamentos fáceis, atendimento de qualidade.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button 
            data-onboarding="schedule-button"
            className={`w-full bg-white text-primary hover:bg-gray-100 ${animations.buttonHover} py-3 text-base font-medium`}
            onClick={onScheduleEvaluation}
            disabled={schedulingLoading}
          >
            <Calendar className="h-5 w-5 mr-2" />
            {schedulingLoading ? 'Agendando...' : 'Agendar Avaliação Gratuita'}
          </Button>
          
          <Button 
            data-onboarding="units-button"
            variant="outline"
            className={`w-full bg-transparent border-white text-white hover:bg-white hover:text-primary ${animations.buttonHover} py-3 text-base font-medium`}
            onClick={onViewUnits}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Ver Nossas Unidades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
