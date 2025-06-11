import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PWADashboard } from '@/components/ui/pwa-dashboard';
import { PWAPerformanceMonitor as OldPWAPerformanceMonitor } from '@/components/ui/pwa-performance';
import { PWANotificationCenter as OldPWANotificationCenter } from '@/components/ui/pwa-notifications';
import { PWAPerformanceMonitor } from '@/components/PWA/PWAPerformanceMonitor';
import { PWANotificationCenter } from '@/components/PWA/PWANotificationCenter';
import { animations } from '@/lib/animations';
import { 
  Settings, 
  Smartphone, 
  Activity, 
  Bell, 
  Database,
  Info
} from 'lucide-react';

interface PWASettingsPageProps {
  onNavigate: (page: string) => void;
}

export const PWASettingsPage: React.FC<PWASettingsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`container mx-auto p-4 space-y-6 ${animations.fadeIn}`}>
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6 text-primary" />
            Configurações PWA
          </CardTitle>
          <p className="text-gray-600">
            Gerencie todas as funcionalidades do Progressive Web App
          </p>
        </CardHeader>
      </Card>

      {/* PWA Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Armazenamento</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <PWADashboard />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Sobre o PWA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Funcionalidades Ativas</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✅ Instalação como app nativo</li>
                    <li>✅ Funcionamento offline</li>
                    <li>✅ Notificações push</li>
                    <li>✅ Sincronização em background</li>
                    <li>✅ Cache inteligente</li>
                    <li>✅ Atalhos de ações rápidas</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Benefícios</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>🚀 Carregamento mais rápido</li>
                    <li>📱 Experiência nativa</li>
                    <li>🔄 Sincronização automática</li>
                    <li>🔔 Lembretes inteligentes</li>
                    <li>💾 Uso eficiente de dados</li>
                    <li>⚡ Performance otimizada</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <PWAPerformanceMonitor />
          
          <Card>
            <CardHeader>
              <CardTitle>Otimizações Implementadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Cache Strategy</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Cache First para recursos estáticos</li>
                    <li>• Network First para APIs</li>
                    <li>• Stale While Revalidate para páginas</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Otimizações de Build</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Code splitting por funcionalidade</li>
                    <li>• Lazy loading de componentes</li>
                    <li>• Minificação e compressão</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <PWANotificationCenter />
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gerenciamento de Armazenamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-4">
                    O app utiliza diferentes tipos de armazenamento para oferecer 
                    a melhor experiência offline e performance otimizada.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Cache do Navegador</h5>
                      <p className="text-blue-700 text-sm">
                        Armazena recursos estáticos como CSS, JS e imagens 
                        para carregamento mais rápido.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">IndexedDB</h5>
                      <p className="text-green-700 text-sm">
                        Dados offline como agendamentos e informações 
                        de clínicas para funcionar sem internet.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-2">LocalStorage</h5>
                      <p className="text-purple-700 text-sm">
                        Configurações do usuário e preferências 
                        que persistem entre sessões.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2">Service Worker Cache</h5>
                      <p className="text-orange-700 text-sm">
                        Cache avançado que permite funcionamento 
                        offline completo do aplicativo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
