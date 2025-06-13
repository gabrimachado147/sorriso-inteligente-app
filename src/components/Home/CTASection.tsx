
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
        <CardHeader className="mobile-card-header">
          <div className="flex justify-center mb-3 md:mb-4">
            <Heart className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </div>
          <CardTitle className="mobile-subtitle md:text-2xl text-primary">
            Pronto para cuidar do seu sorriso?
          </CardTitle>
          <CardDescription className="mobile-text md:text-lg mt-2">
            Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
          </CardDescription>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row justify-center items-center">
            <Button size="lg" className="mobile-button w-full md:w-auto" onClick={() => onNavigate('/schedule')}>
              Agendar Consulta
            </Button>
            <Button size="lg" variant="outline" className="mobile-button w-full md:w-auto" onClick={onWhatsAppContact}>
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 md:gap-4 text-sm md:text-sm text-muted-foreground mt-5 md:mt-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 md:h-4 md:w-4" />
              <span>Resposta rápida</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 md:h-4 md:w-4" />
              <span>5 estrelas</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 md:h-4 md:w-4" />
              <span className="hidden md:inline">Atendimento humanizado</span>
              <span className="md:hidden">Humanizado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
