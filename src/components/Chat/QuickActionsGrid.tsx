
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Phone } from 'lucide-react';
import { animations } from '@/lib/animations';
import { QuickAction } from './types';

interface QuickActionsGridProps {
  onQuickAction: (message: string) => void;
  disabled: boolean;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onQuickAction, disabled }) => {
  const quickActions: QuickAction[] = [
    {
      text: "Agendar consulta",
      action: () => onQuickAction("Quero agendar uma consulta"),
      icon: Calendar
    },
    {
      text: "Encontrar clínicas",
      action: () => onQuickAction("Onde encontro clínicas próximas?"),
      icon: MapPin
    },
    {
      text: "Horários disponíveis",
      action: () => onQuickAction("Quais horários estão disponíveis?"),
      icon: Clock
    },
    {
      text: "Contato emergência",
      action: () => onQuickAction("Preciso de atendimento de emergência"),
      icon: Phone
    }
  ];

  return (
    <div className={`p-4 border-t border-gray-200 ${animations.slideInBottom}`}>
      <p className="text-sm text-gray-600 mb-3">Ações rápidas:</p>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`justify-start gap-2 ${animations.buttonHover}`}
            onClick={action.action}
            disabled={disabled}
          >
            <action.icon className="h-4 w-4" />
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
