
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${animations.slideInBottom}`}>
      <Card 
        data-onboarding="chat-button"
        className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
        onClick={() => onQuickAction('chat')}
      >
        <CardContent className="p-4 text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">Chat IA</p>
          <p className="text-xs text-gray-500">Tire suas dúvidas</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
        onClick={() => onQuickAction('locations')}
      >
        <CardContent className="p-4 text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">Unidades</p>
          <p className="text-xs text-gray-500">5 cidades</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
        onClick={() => onQuickAction('appointments')}
      >
        <CardContent className="p-4 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">Agendar</p>
          <p className="text-xs text-gray-500">Nova consulta</p>
        </CardContent>
      </Card>

      <Card 
        data-onboarding="emergency-button"
        className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
        onClick={() => onQuickAction('emergency')}
      >
        <CardContent className="p-4 text-center">
          <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">Urgência</p>
        </CardContent>
      </Card>
    </div>
  );
};
