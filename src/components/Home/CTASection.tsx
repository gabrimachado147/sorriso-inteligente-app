
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
    <div className={`text-center space-y-4 ${animations.scaleIn}`}>
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary">
            Pronto para cuidar do seu sorriso?
          </CardTitle>
          <CardDescription className="text-lg">
            Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => onNavigate('/appointments')}>
              Agendar Consulta
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={onWhatsAppContact}>
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Resposta rápida</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>5 estrelas</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Atendimento humanizado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
