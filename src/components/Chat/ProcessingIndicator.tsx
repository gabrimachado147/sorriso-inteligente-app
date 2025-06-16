
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';
import { animations } from '@/lib/animations';

interface ProcessingIndicatorProps {
  stage: 'analyzing' | 'scheduling' | 'confirming';
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ stage }) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return {
          text: 'Analisando sua mensagem...',
          icon: '🤔',
          color: 'blue'
        };
      case 'scheduling':
        return {
          text: 'Verificando horários disponíveis...',
          icon: '📅',
          color: 'purple'
        };
      case 'confirming':
        return {
          text: 'Confirmando seu agendamento...',
          icon: '✅',
          color: 'green'
        };
      default:
        return {
          text: 'Processando...',
          icon: '⏳',
          color: 'gray'
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <Card className={`bg-${stageInfo.color}-50 border-${stageInfo.color}-200 ${animations.fadeIn}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Bot className={`h-5 w-5 text-${stageInfo.color}-600`} />
          </div>
          
          <div className="flex items-center gap-2">
            <Loader2 className={`h-4 w-4 animate-spin text-${stageInfo.color}-600`} />
            <span className={`text-sm text-${stageInfo.color}-700`}>
              {stageInfo.icon} {stageInfo.text}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
