import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Star } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useContactActions } from '@/hooks/useContactActions';

export const CTASection: React.FC = () => {
  const { handleScheduleNavigation } = useHomeNavigation();
  const { handleWhatsAppContact } = useContactActions();

  return (
    <div className={`text-center space-y-6 px-4 ${animations.scaleIn}`}>
      <Card className="bg-primary/5 border-primary/20 mobile-card-spacing">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <Heart className="h-14 w-14 text-primary" />
          </div>
          <CardTitle className="text-lg text-primary mobile-text-xl text-center">
            Pronto para cuidar do seu sorriso?
          </CardTitle>
          <CardDescription className="text-xl mobile-text-lg text-center">
            Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 w-full sm:w-auto mobile-touch-target" 
              onClick={handleScheduleNavigation}
            >
              Agendar Consulta
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-4 w-full sm:w-auto mobile-touch-target" 
              onClick={() => handleWhatsAppContact()}
            >
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base text-muted-foreground mobile-text-base">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Resposta rápida</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>5 estrelas</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>Atendimento humanizado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
