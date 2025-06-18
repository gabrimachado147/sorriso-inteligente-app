
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Sparkles, Zap } from 'lucide-react';

interface AISelectorProps {
  selectedAI: string;
  onAIChange: (ai: string) => void;
}

const availableAIs = [
  { 
    id: 'asst_TWl3QmvNw0am7N05klbS5zJh', 
    name: 'Enigma Strategist (Seu Assistant)', 
    description: 'Assistant personalizado especializado em estratégia digital',
    icon: Sparkles,
    badge: 'PERSONALIZADO'
  },
  { 
    id: 'gpt-4o-mini', 
    name: 'GPT-4o Mini', 
    description: 'Modelo rápido e eficiente para análises gerais',
    icon: Zap,
    badge: 'RÁPIDO'
  },
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    description: 'Modelo avançado para análises complexas e detalhadas',
    icon: Brain,
    badge: 'AVANÇADO'
  }
];

export const AISelector: React.FC<AISelectorProps> = ({
  selectedAI,
  onAIChange
}) => {
  const currentAI = availableAIs.find(ai => ai.id === selectedAI);
  const IconComponent = currentAI?.icon || Brain;

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-600" />
          Seletor de IA para Análise
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            AI CONFIGURÁVEL
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Escolha a IA para realizar a análise:
          </label>
          <Select value={selectedAI} onValueChange={onAIChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma IA" />
            </SelectTrigger>
            <SelectContent>
              {availableAIs.map((ai) => {
                const Icon = ai.icon;
                return (
                  <SelectItem key={ai.id} value={ai.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">{ai.name}</span>
                        <span className="text-xs text-muted-foreground">{ai.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {currentAI && (
          <div className="p-3 bg-white/60 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm">{currentAI.name}</span>
              <Badge variant="outline" className="text-xs">
                {currentAI.badge}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentAI.description}
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          💡 Dica: Seu assistant personalizado oferece análises estratégicas especializadas
        </div>
      </CardContent>
    </Card>
  );
};
