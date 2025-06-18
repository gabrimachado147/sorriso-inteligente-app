
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Phone } from 'lucide-react';
import { animations } from '@/lib/animations';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';
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
    <div className={`p-4 lg:p-6 ${animations.slideInBottom}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-sm lg:text-base font-medium text-gray-700 mb-2">
            ⚡ Ações Rápidas
          </h3>
          <p className="text-xs lg:text-sm text-gray-500">
            Escolha uma das opções abaixo ou digite sua própria pergunta
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {quickActions.map((action, index) => (
            <InteractiveFeedback key={index} feedbackType="scale">
              <Button
                variant="outline"
                size="sm"
                className={`h-auto p-3 lg:p-4 flex flex-col items-center gap-2 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-green-50 border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 text-gray-700 hover:text-gray-900 ${animations.buttonHover}`}
                onClick={action.action}
                disabled={disabled}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <action.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                <span className="text-xs lg:text-sm font-medium text-center leading-tight">
                  {action.text}
                </span>
              </Button>
            </InteractiveFeedback>
          ))}
        </div>
        
        {/* Indicador visual */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-1 text-gray-400">
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsGrid;
