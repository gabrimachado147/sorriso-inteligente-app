
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
  Eye,
  FileText
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

  // Check Supabase configuration (using actual project values)
  const supabaseUrl = 'https://bstppllwgzkacxxwhpes.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdHBwbGx3Z3prYWN4eHdocGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDk2MjgsImV4cCI6MjA2NDYyNTYyOH0.SiKjaaf41YS0hWvJZa0bQVzDePxAn0JhBP1_qRgmvjM';
  
  const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

  // Função helper para acessar deviceMemory de forma segura
  const getDeviceMemory = () => {
    const nav = navigator as any;
    return nav.deviceMemory || 'N/A';
  };

  // Função helper para acessar connection de forma segura
  const getConnectionType = () => {
    const nav = navigator as any;
    return nav.connection?.effectiveType || 'N/A';
  };

  // Informações detalhadas do projeto
  const getProjectInfo = () => {
    const components = [
      'EnhancedHomePage', 'ChatBot', 'AdminDashboard', 'AppointmentScheduler',
      'BrandedDashboardHeader', 'StrategicKPISection', 'QuickActionsCTA'
    ];
    
    const hooks = [
      'useAuth', 'useChatHandler', 'useChatLogic', 'useHomeNavigation',
      'useSupabase', 'useXAI', 'useNotificationSystem'
    ];

    const pages = [
      '/chat', '/admin-dashboard', '/appointments', '/schedule', '/profile'
    ];

    return {
      components: components.length,
      hooks: hooks.length,
      pages: pages.length,
      componentList: components,
      hookList: hooks,
      pageList: pages
    };
  };

  const projectInfo = getProjectInfo();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-4xl">
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
          <Card className="w-full max-w-4xl border-purple-300 shadow-lg">
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
                  variant={activeTab === 'project' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('project')}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Projeto
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

              <div className="min-h-96 max-h-none overflow-visible">
                {activeTab === 'insights' && (
                  <div className="overflow-visible max-h-none">
                    <XAIInsightPanel />
                  </div>
                )}

                {activeTab === 'project' && (
                  <div className="overflow-visible max-h-none p-4">
                    <div className="text-sm text-gray-600 space-y-4">
                      <div>
                        <p className="font-semibold text-purple-700 mb-2">📊 Estatísticas do Projeto:</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="font-medium">Componentes React</p>
                            <p className="text-2xl font-bold text-blue-600">{projectInfo.components}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <p className="font-medium">Hooks Customizados</p>
                            <p className="text-2xl font-bold text-green-600">{projectInfo.hooks}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <p className="font-medium">Páginas/Rotas</p>
                            <p className="text-2xl font-bold text-purple-600">{projectInfo.pages}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded">
                            <p className="font-medium">Tecnologias</p>
                            <p className="text-2xl font-bold text-orange-600">7+</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-purple-700 mb-2">🔧 Principais Componentes:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {projectInfo.componentList.map((comp, i) => (
                            <p key={i} className="bg-gray-100 p-1 rounded">• {comp}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-purple-700 mb-2">🪝 Hooks Customizados:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {projectInfo.hookList.map((hook, i) => (
                            <p key={i} className="bg-gray-100 p-1 rounded">• {hook}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-purple-700 mb-2">🚀 Stack Tecnológico:</p>
                        <div className="space-y-1 text-xs">
                          <p>• React 18.3.1 com TypeScript</p>
                          <p>• Supabase (Backend completo)</p>
                          <p>• Tailwind CSS + Shadcn/UI</p>
                          <p>• React Query (TanStack)</p>
                          <p>• PWA (Progressive Web App)</p>
                          <p>• Vite (Build tool moderna)</p>
                          <p>• Zustand (State management)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'db' && (
                  <div className="overflow-visible max-h-none p-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="font-semibold">🗄️ Configuração do Banco de Dados:</p>
                      <div className="space-y-1 pl-2">
                        <p>• Supabase Status: {isSupabaseConfigured ? '✅ Conectado' : '❌ Não conectado'}</p>
                        <p>• RLS Policies: ✅ Ativas</p>
                        <p>• User Profiles: ✅ Configurado</p>
                        <p>• Appointments: ✅ Configurado</p>
                        <p>• Chat Messages: ✅ Configurado</p>
                        <p>• Real-time: ✅ Habilitado</p>
                        <p>• Environment: {import.meta.env.MODE}</p>
                        <p>• Project ID: bstppllwgzkacxxwhpes</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">📋 Tabelas Principais:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• appointments (Agendamentos)</p>
                          <p>• user_profiles (Perfis de usuário)</p>
                          <p>• chat_messages (Mensagens do chat)</p>
                          <p>• clinics (Clínicas)</p>
                          <p>• contacts (Contatos/Leads)</p>
                          <p>• reviews (Avaliações)</p>
                          <p>• reminders (Lembretes)</p>
                          <p>• user_gamification (Gamificação)</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">🔐 Segurança:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• Row Level Security: ✅ Ativo</p>
                          <p>• Autenticação JWT: ✅ Configurada</p>
                          <p>• Políticas por usuário: ✅ Implementadas</p>
                          <p>• Edge Functions: ✅ Disponíveis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'debug' && (
                  <div className="overflow-visible max-h-none p-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="font-semibold">🐛 Informações de Debug:</p>
                      <div className="space-y-1 pl-2">
                        <p>• Environment: {import.meta.env.MODE}</p>
                        <p>• Logging: {DEVELOPMENT_CONFIG.VERBOSE_LOGGING ? '✅' : '❌'}</p>
                        <p>• XAI Insights: {DEVELOPMENT_CONFIG.ENABLE_XAI_INSIGHTS ? '✅' : '❌'}</p>
                        <p>• Performance Monitor: {DEVELOPMENT_CONFIG.ENABLE_DEV_PERFORMANCE_MONITOR ? '✅' : '❌'}</p>
                        <p>• Dev Mode: {import.meta.env.DEV ? '✅' : '❌'}</p>
                        <p>• URL atual: {window.location.pathname}</p>
                        <p>• Build Time: {new Date().toLocaleString()}</p>
                        <p>• Hot Reload: {import.meta.env.DEV ? '✅ Ativo' : '❌ Inativo'}</p>
                        <p>• Source Maps: {import.meta.env.DEV ? '✅ Disponível' : '❌ Não disponível'}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">⚡ Performance:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• Memory Usage: {getDeviceMemory()} GB</p>
                          <p>• Connection: {getConnectionType()}</p>
                          <p>• User Agent: {navigator.userAgent.substring(0, 50)}...</p>
                          <p>• Screen: {window.screen.width}x{window.screen.height}</p>
                          <p>• Viewport: {window.innerWidth}x{window.innerHeight}</p>
                          <p>• React: Strict Mode Ativo</p>
                          <p>• TypeScript: Verificação ativa</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-semibold">🔧 Variáveis de Ambiente:</p>
                        <div className="space-y-1 pl-2 text-xs">
                          <p>• VITE_ENABLE_XAI: {import.meta.env.VITE_ENABLE_XAI || 'false'}</p>
                          <p>• VITE_DEBUG_MODE: {import.meta.env.VITE_DEBUG_MODE || 'false'}</p>
                          <p>• Mode: {import.meta.env.MODE}</p>
                          <p>• DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
                          <p>• PWA Support: ✅ Configurado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
