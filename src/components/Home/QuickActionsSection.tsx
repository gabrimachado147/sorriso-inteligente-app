
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';
import { toastInfo } from '@/components/ui/custom-toast';
import { animations } from '@/lib/animations';

interface QuickActionsSectionProps {
  onNavigate: (path: string) => void;
  onEmergencyCall: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ 
  onNavigate, 
  onEmergencyCall 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${animations.slideInLeft}`}>
      <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
            onClick={() => onNavigate('/appointments')}>
        <CardHeader className="text-center pb-2">
          <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">Agendar</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Marque sua consulta rapidamente
          </p>
          <Button className="w-full" onClick={(e) => {
            e.stopPropagation();
            onNavigate('/appointments');
          }}>
            Novo Agendamento
          </Button>
        </CardContent>
      </Card>

      <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
            onClick={() => onNavigate('/chat')}>
        <CardHeader className="text-center pb-2">
          <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Tire suas dúvidas conosco
          </p>
          <Button variant="outline" className="w-full" onClick={(e) => {
            e.stopPropagation();
            onNavigate('/chat');
          }}>
            Iniciar Chat
          </Button>
        </CardContent>
      </Card>

      <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
            onClick={() => onNavigate('/clinics')}>
        <CardHeader className="text-center pb-2">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">Unidades</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Encontre a unidade mais próxima
          </p>
          <Button variant="outline" className="w-full" onClick={(e) => {
            e.stopPropagation();
            onNavigate('/clinics');
          }}>
            Ver Locais
          </Button>
        </CardContent>
      </Card>

      <Card className={`${animations.cardHover} border-red-200 hover:border-red-400 transition-all bg-red-50 cursor-pointer`}
            onClick={onEmergencyCall}>
        <CardHeader className="text-center pb-2">
          <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <CardTitle className="text-lg text-red-600">Emergência</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onEmergencyCall();
            }}
          >
            Contatar Agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
