
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Bot, Brain } from 'lucide-react';
import { AICodeAssistant } from './AICodeAssistant';
import { XAIInsightPanel } from './XAIInsightPanel';
import { DeveloperErrorBoundary } from './DeveloperErrorBoundary';

export const AIAssistantTab: React.FC = () => {
  return (
    <TabsContent value="ai-assistant" className="space-y-6 mt-6">
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            Assistente de IA para Desenvolvimento
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              INTELIGÊNCIA APRIMORADA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeveloperErrorBoundary>
            <AICodeAssistant />
          </DeveloperErrorBoundary>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
            Insights Estratégicos com Enigma
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              ESPECIALISTA EM ESTRATÉGIA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeveloperErrorBoundary>
            <XAIInsightPanel />
          </DeveloperErrorBoundary>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
