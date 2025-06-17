
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

interface HeroWelcomeSectionProps {
  onViewUnits: () => void;
  schedulingLoading: boolean;
}

export const HeroWelcomeSection: React.FC<HeroWelcomeSectionProps> = ({
  onViewUnits,
  schedulingLoading
}) => {
  const navigate = useNavigate();

  const handleScheduleEvaluation = () => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Card className={`bg-gradient-to-r from-primary to-blue-600 text-white ${animations.fadeIn}`}>
      <CardContent className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo à Senhor Sorriso!</h2>
        <p className="mb-4 opacity-90">Seu sorriso perfeito está a um clique de distância</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            className={`bg-white text-gray-900 hover:bg-gray-100 font-medium ${animations.buttonHover}`}
            onClick={handleScheduleEvaluation}
            disabled={schedulingLoading}
            aria-label="Agendar avaliação odontológica gratuita"
          >
            {schedulingLoading ? 'Agendando...' : 'Agendar Avaliação'}
          </Button>
          <Button 
            variant="outline"
            className={`bg-transparent border-white text-white hover:bg-white hover:text-gray-900 font-medium ${animations.buttonHover}`}
            onClick={onViewUnits}
            aria-label="Ver todas as unidades da Senhor Sorriso"
          >
            Nossas Unidades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
