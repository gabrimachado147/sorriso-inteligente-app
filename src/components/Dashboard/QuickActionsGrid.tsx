
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';
import { animations } from '@/lib/animations';

interface QuickActionsGridProps {
  onQuickAction: (action: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onQuickAction }) => {
  const actions = [
    { icon: MessageCircle, key: 'chat', title: 'Chat IA', subtitle: 'Tire suas dúvidas' },
    { icon: MapPin, key: 'clinics', title: 'Unidades', subtitle: '5 cidades' },
    { icon: Calendar, key: 'schedule', title: 'Agendar', subtitle: 'Nova consulta' },
    { icon: Phone, key: 'emergency', title: 'Urgência', subtitle: 'Contato emergência' }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${animations.slideInBottom}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Card 
            key={action.key}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
            onClick={() => onQuickAction(action.key)}
          >
            <CardContent className="p-4 text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">{action.title}</p>
              <p className="text-xs text-gray-500">{action.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
