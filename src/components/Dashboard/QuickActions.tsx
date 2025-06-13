
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  return (
    <div className={`grid grid-cols-2 gap-3 max-w-2xl mx-auto ${animations.slideInBottom}`}>
      <Card 
        data-onboarding="chat-button"
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${animations.cardHover} min-h-[100px]`}
        onClick={() => onQuickAction('chat')}
      >
        <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium text-sm">Chat IA</p>
          <p className="text-xs text-gray-500 mt-1">Tire suas dúvidas</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${animations.cardHover} min-h-[100px]`}
        onClick={() => onQuickAction('clinics')}
      >
        <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium text-sm">Unidades</p>
          <p className="text-xs text-gray-500 mt-1">5 cidades</p>
        </CardContent>
      </Card>

      <Card 
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${animations.cardHover} min-h-[100px]`}
        onClick={() => onQuickAction('appointments')}
      >
        <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="font-medium text-sm">Agendar</p>
          <p className="text-xs text-gray-500 mt-1">Nova consulta</p>
        </CardContent>
      </Card>

      <Card 
        data-onboarding="emergency-button"
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${animations.cardHover} bg-red-50 border-red-200 min-h-[100px]`}
        onClick={() => onQuickAction('emergency')}
      >
        <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
          <Phone className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <p className="font-medium text-sm text-red-600">Urgência</p>
          <p className="text-xs text-red-500 mt-1">Contato rápido</p>
        </CardContent>
      </Card>
    </div>
  );
};
