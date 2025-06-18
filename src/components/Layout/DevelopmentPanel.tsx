
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { XAIInsightPanel } from '@/components/Developer/XAIInsightPanel';
import { DevelopmentPanelTabs } from '@/components/Developer/DevelopmentPanelTabs';
import { ProjectInfoTab } from '@/components/Developer/ProjectInfoTab';
import { DatabaseInfoTab } from '@/components/Developer/DatabaseInfoTab';
import { DebugInfoTab } from '@/components/Developer/DebugInfoTab';
import { useDevelopmentPanel } from '@/hooks/useDevelopmentPanel';
import { DEVELOPMENT_CONFIG, isDevelopment } from '@/config/development';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Code,
  ExternalLink
} from 'lucide-react';

export const DevelopmentPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    isSupabaseConfigured,
    projectInfo
  } = useDevelopmentPanel();

  console.log('🔧 DevelopmentPanel renderizando:', { 
    isDevelopment, 
    showDevTools: DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS,
    mode: import.meta.env.MODE 
  });

  if (!DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS) {
    console.log('❌ Dev Tools desabilitado na configuração');
    return null;
  }

  console.log('✅ Dev Tools será exibido');

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-2">
          {/* Botão para página completa */}
          <Button
            onClick={() => navigate('/developer')}
            variant="outline"
            size="sm"
            className="w-full bg-blue-100 border-blue-300 hover:bg-blue-200 shadow-lg"
          >
            <Code className="h-4 w-4 mr-2" />
            Página Completa
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>

          {/* Painel compacto */}
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-purple-100 border-purple-300 hover:bg-purple-200 shadow-lg"
            >
              <Settings className="h-4 w-4 mr-2" />
              Dev Tools Mini
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <Card className="w-full max-w-sm border-purple-300 shadow-xl bg-white mt-2 max-h-96 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Code className="h-3 w-3" />
                Dev Tools - Mini
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  COMPACTO
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <DevelopmentPanelTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              <div className="max-h-60 overflow-y-auto">
                {activeTab === 'insights' && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">
                      ⚡ Use a página completa para insights detalhados
                    </p>
                    <Button
                      onClick={() => navigate('/developer')}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Abrir IA Insights
                    </Button>
                  </div>
                )}

                {activeTab === 'project' && (
                  <div className="scale-75 origin-top-left">
                    <ProjectInfoTab projectInfo={projectInfo} />
                  </div>
                )}

                {activeTab === 'db' && (
                  <div className="scale-75 origin-top-left">
                    <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
                  </div>
                )}

                {activeTab === 'debug' && (
                  <div className="scale-75 origin-top-left">
                    <DebugInfoTab />
                  </div>
                )}
              </div>

              <div className="text-xs text-center text-gray-500 pt-2 border-t">
                Para funcionalidades completas, use a página dedicada
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
