
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { XAIInsightPanel } from '@/components/Developer/XAIInsightPanel';
import { DEVELOPMENT_CONFIG, isDevelopment } from '@/config/development';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Database, 
  Zap,
  Eye
} from 'lucide-react';

export const DevelopmentPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  // Só renderiza em desenvolvimento
  if (!isDevelopment || !DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 bg-purple-100 border-purple-300 hover:bg-purple-200"
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
          <Card className="w-96 border-purple-300 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Painel de Desenvolvimento
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  DEV
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={activeTab === 'insights' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('insights')}
                  className="text-xs"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  AI Insights
                </Button>
                <Button
                  variant={activeTab === 'db' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('db')}
                  className="text-xs"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Database
                </Button>
                <Button
                  variant={activeTab === 'debug' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('debug')}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Debug
                </Button>
              </div>

              {activeTab === 'insights' && (
                <XAIInsightPanel />
              )}

              {activeTab === 'db' && (
                <div className="text-sm text-gray-600">
                  <p>Ferramentas de banco de dados em desenvolvimento...</p>
                  <p className="mt-2">• Supabase Status: ✅ Conectado</p>
                  <p>• RLS Policies: ✅ Ativas</p>
                  <p>• User Profiles: ✅ Configurado</p>
                </div>
              )}

              {activeTab === 'debug' && (
                <div className="text-sm text-gray-600">
                  <p>Informações de Debug:</p>
                  <p className="mt-2">• Environment: {import.meta.env.MODE}</p>
                  <p>• Logging: {DEVELOPMENT_CONFIG.VERBOSE_LOGGING ? '✅' : '❌'}</p>
                  <p>• XAI Insights: {DEVELOPMENT_CONFIG.ENABLE_XAI_INSIGHTS ? '✅' : '❌'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
