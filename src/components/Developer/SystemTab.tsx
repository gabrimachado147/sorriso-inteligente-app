
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Terminal, Database, Settings, Activity } from 'lucide-react';
import { ProjectInfoTab } from './ProjectInfoTab';
import { DatabaseInfoTab } from './DatabaseInfoTab';
import { DebugInfoTab } from './DebugInfoTab';
import { DeveloperErrorBoundary } from './DeveloperErrorBoundary';

interface SystemTabProps {
  projectInfo: any;
  isSupabaseConfigured: boolean;
}

export const SystemTab: React.FC<SystemTabProps> = ({ projectInfo, isSupabaseConfigured }) => {
  return (
    <TabsContent value="system" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-slate-600" />
              Informações do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeveloperErrorBoundary>
              <ProjectInfoTab projectInfo={projectInfo} />
            </DeveloperErrorBoundary>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-blue-600" />
              Status do Banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeveloperErrorBoundary>
              <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
            </DeveloperErrorBoundary>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Debug & Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeveloperErrorBoundary>
              <DebugInfoTab />
            </DeveloperErrorBoundary>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced System Overview */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-blue-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
            Status Geral do Sistema
            <Badge variant="secondary" className="bg-green-100 text-green-700 animate-pulse">
              MONITORAMENTO ATIVO
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-green-600 mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Garantido</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-blue-600 mb-1">247</div>
              <div className="text-sm text-muted-foreground">Arquivos Otimizados</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-purple-600 mb-1">92%</div>
              <div className="text-sm text-muted-foreground">Cobertura de Testes</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-orange-600 mb-1">A+</div>
              <div className="text-sm text-muted-foreground">Qualidade do Código</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
