
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Star } from 'lucide-react';
import { animations } from '@/lib/animations';

interface CTASectionProps {
  onNavigate: (path: string) => void;
  onWhatsAppContact: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate, onWhatsAppContact }) => {
  return (
    <div className={`text-center mobile-spacing ${animations.scaleIn}`}>
      <Card className="bg-primary/5 border-primary/20 mobile-card">
        <CardHeader className="pb-2 md:pb-6">
          <div className="flex justify-center mb-2 md:mb-4">
            <Heart className="h-8 w-8 md:h-12 md:w-12 text-primary" />
          </div>
          <CardTitle className="mobile-subtitle md:text-2xl text-primary">
            Pronto para cuidar do seu sorriso?
          </CardTitle>
          <CardDescription className="mobile-text md:text-lg">
            Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
          </CardDescription>
        </CardHeader>
        <CardContent className="mobile-spacing pt-0">
          <div className="flex flex-col gap-2 md:gap-4 md:flex-row justify-center items-center">
            <Button size="lg" className="mobile-button w-full md:w-auto text-sm md:text-lg px-6 md:px-8" onClick={() => onNavigate('/schedule')}>
              Agendar Consulta
            </Button>
            <Button size="lg" variant="outline" className="mobile-button w-full md:w-auto text-sm md:text-lg px-6 md:px-8" onClick={onWhatsAppContact}>
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>Resposta rápida</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 md:h-4 md:w-4" />
              <span>5 estrelas</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Atendimento humanizado</span>
              <span className="md:hidden">Humanizado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
