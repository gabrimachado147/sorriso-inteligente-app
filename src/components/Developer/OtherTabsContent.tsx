
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';
import { AdvancedCodeAnalysis } from './AdvancedCodeAnalysis';
import { DatabaseManager } from './DatabaseManager';
import { DeveloperOperations } from './DeveloperOperations';
import { DeveloperRecommendations } from './DeveloperRecommendations';
import { OptimizationDocs } from './OptimizationDocs';
import { DeveloperErrorBoundary } from './DeveloperErrorBoundary';

export const OtherTabsContent: React.FC = () => {
  return (
    <>
      <TabsContent value="code-analysis" className="space-y-6 mt-6">
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-1 border border-green-200">
          <DeveloperErrorBoundary>
            <AdvancedCodeAnalysis />
          </DeveloperErrorBoundary>
        </div>
      </TabsContent>

      <TabsContent value="database" className="space-y-6 mt-6">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-1 border border-teal-200">
          <DeveloperErrorBoundary>
            <DatabaseManager />
          </DeveloperErrorBoundary>
        </div>
      </TabsContent>

      <TabsContent value="operations" className="space-y-6 mt-6">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-cyan-600" />
              Operações Automatizadas Inteligentes
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                AUTOMAÇÃO AVANÇADA
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeveloperErrorBoundary>
              <DeveloperOperations />
            </DeveloperErrorBoundary>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-6 mt-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-1 border border-yellow-200">
          <DeveloperErrorBoundary>
            <DeveloperRecommendations />
          </DeveloperErrorBoundary>
        </div>
      </TabsContent>

      <TabsContent value="docs" className="space-y-6 mt-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-1 border border-orange-200">
          <DeveloperErrorBoundary>
            <OptimizationDocs />
          </DeveloperErrorBoundary>
        </div>
      </TabsContent>
    </>
  );
};
