
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
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Code
} from 'lucide-react';

export const DevelopmentPanel: React.FC = () => {
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

  // Forçar exibição em desenvolvimento
  if (!DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS) {
    console.log('❌ Dev Tools desabilitado na configuração');
    return null;
  }

  console.log('✅ Dev Tools será exibido');

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-4xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 bg-purple-100 border-purple-300 hover:bg-purple-200 shadow-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Dev Tools
            {isOpen ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-full max-w-4xl border-purple-300 shadow-xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Painel de Desenvolvimento - Sorriso Inteligente
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  DEV
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DevelopmentPanelTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              <div className="min-h-96 max-h-none overflow-visible">
                {activeTab === 'insights' && (
                  <div className="overflow-visible max-h-none">
                    <XAIInsightPanel />
                  </div>
                )}

                {activeTab === 'project' && (
                  <ProjectInfoTab projectInfo={projectInfo} />
                )}

                {activeTab === 'db' && (
                  <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
                )}

                {activeTab === 'debug' && (
                  <DebugInfoTab />
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
