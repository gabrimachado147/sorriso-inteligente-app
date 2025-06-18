
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Brain } from 'lucide-react';
import { LiveCodeAnalysis } from './LiveCodeAnalysis';
import { DeveloperErrorBoundary } from './DeveloperErrorBoundary';

export const LiveAnalysisTab: React.FC = () => {
  return (
    <TabsContent value="live-analysis" className="space-y-6 mt-6">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
            Análise de Código ao Vivo
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 animate-pulse">
              IMPLEMENTADO
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeveloperErrorBoundary>
            <LiveCodeAnalysis />
          </DeveloperErrorBoundary>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
