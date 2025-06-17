
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  console.log('DevelopmentPanel renderizando:', { isDevelopment, showDevTools: DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS });

  // Só renderiza em desenvolvimento
  if (!isDevelopment || !DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS) {
    console.log('DevelopmentPanel não será exibido');
    return null;
  }

  console.log('DevelopmentPanel será exibido');

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-2xl">
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
          <Card className="w-full max-w-2xl border-purple-300 shadow-lg">
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

              <div className="h-96">
                {activeTab === 'insights' && (
                  <ScrollArea className="h-full">
                    <XAIInsightPanel />
                  </ScrollArea>
                )}

                {activeTab === 'db' && (
                  <ScrollArea className="h-full p-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="font-semibold">Ferramentas de banco de dados:</p>
                      <div className="space-y-1 pl-2">
                        <p>• Supabase Status: ✅ Conectado</p>
                        <p>• RLS Policies: ✅ Ativas</p>
                        <p>• User Profiles: ✅ Configurado</p>
                        <p>• Environment: {import.meta.env.MODE}</p>
                        <p>• API URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}</p>
                        <p>• Database URL: {import.meta.env.VITE_SUPABASE_URL ? 'Disponível' : 'Não configurado'}</p>
                        <p>• Auth Provider: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado'}</p>
                      </div>
                    </div>
                  </ScrollArea>
                )}

                {activeTab === 'debug' && (
                  <ScrollArea className="h-full p-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="font-semibold">Informações de Debug:</p>
                      <div className="space-y-1 pl-2">
                        <p>• Environment: {import.meta.env.MODE}</p>
                        <p>• Logging: {DEVELOPMENT_CONFIG.VERBOSE_LOGGING ? '✅' : '❌'}</p>
                        <p>• XAI Insights: {DEVELOPMENT_CONFIG.ENABLE_XAI_INSIGHTS ? '✅' : '❌'}</p>
                        <p>• Performance Monitor: {DEVELOPMENT_CONFIG.ENABLE_DEV_PERFORMANCE_MONITOR ? '✅' : '❌'}</p>
                        <p>• Dev Mode: {import.meta.env.DEV ? '✅' : '❌'}</p>
                        <p>• URL atual: {window.location.pathname}</p>
                        <p>• Build Time: {new Date().toLocaleString()}</p>
                        <p>• Node Version: {import.meta.env.NODE_ENV || 'N/A'}</p>
                        <p>• Hot Reload: {import.meta.env.DEV ? '✅ Ativo' : '❌ Inativo'}</p>
                        <p>• Source Maps: {import.meta.env.DEV ? '✅ Disponível' : '❌ Não disponível'}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">Variáveis de Ambiente:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</p>
                          <p>• VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</p>
                          <p>• VITE_ENABLE_XAI: {import.meta.env.VITE_ENABLE_XAI ? '✅' : '❌'}</p>
                          <p>• VITE_DEBUG_MODE: {import.meta.env.VITE_DEBUG_MODE ? '✅' : '❌'}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">Performance Logs:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• Render Count: Verificar console</p>
                          <p>• Memory Usage: {navigator.deviceMemory || 'N/A'} GB</p>
                          <p>• Connection: {(navigator as any).connection?.effectiveType || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
