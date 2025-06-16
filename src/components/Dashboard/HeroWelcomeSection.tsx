
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
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
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo à Senhor Sorriso!</h1>
        <p className="mb-4 opacity-90">Seu sorriso perfeito está a um clique de distância</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className={`bg-white text-primary hover:bg-gray-100 ${animations.buttonHover}`}
            onClick={handleScheduleEvaluation}
            disabled={schedulingLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {schedulingLoading ? 'Agendando...' : 'Agendar Avaliação Gratuita'}
          </Button>
          <Button 
            variant="outline"
            className={`bg-transparent border-white text-white hover:bg-white hover:text-primary ${animations.buttonHover}`}
            onClick={onViewUnits}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Ver Nossas Unidades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
