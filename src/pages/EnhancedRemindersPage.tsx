
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ReminderManager } from '@/components/Reminders/ReminderManager';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { GamificationStats } from '@/components/ui/gamification-elements';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, Clock, Smartphone } from 'lucide-react';
import { animations } from '@/lib/animations';

const EnhancedRemindersPage = () => {
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Lembretes', href: '/reminders', icon: Bell }
  ];

  return (
    <>
      <PageHead
        title="Lembretes Inteligentes - Senhor Sorriso"
        description="Configure e gerencie seus lembretes de consultas, medicações e cuidados com a saúde bucal de forma inteligente."
        keywords="lembretes, notificações, consultas, medicação, agendamentos, cuidados saúde bucal, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/reminders"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <Bell className="h-8 w-8 text-primary" />
                    Lembretes Inteligentes
                  </h1>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Nunca mais perca uma consulta ou medicação. Configure lembretes personalizados 
                    para manter sua saúde bucal sempre em dia.
                  </p>
                </div>

                {/* Benefícios dos Lembretes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Consultas Organizadas</h3>
                      <p className="text-sm text-gray-600">
                        Receba avisos personalizados antes das suas consultas
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Horários Flexíveis</h3>
                      <p className="text-sm text-gray-600">
                        Configure lembretes com antecedência de minutos até dias
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Multi-canal</h3>
                      <p className="text-sm text-gray-600">
                        Notificações push, email e SMS para não perder nada
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Gamificação Mobile */}
                  <div className="lg:hidden">
                    <GamificationStats />
                  </div>

                  {/* Gamificação Desktop */}
                  <div className="hidden lg:block">
                    <GamificationStats />
                  </div>

                  {/* Gerenciador de Lembretes */}
                  <div className="lg:col-span-2">
                    <ReminderManager />
                  </div>

                  {/* Feedback e Dicas */}
                  <div className="space-y-6">
                    <FeedbackSystem 
                      pageContext="Sistema de Lembretes"
                      onSubmit={(feedback) => {
                        console.log('Feedback Lembretes:', feedback);
                      }}
                    />

                    {/* Dicas de Uso */}
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-yellow-900 mb-3">💡 Dicas para Lembretes Eficazes:</h3>
                        <div className="space-y-2 text-sm text-yellow-800">
                          <div className="flex items-start gap-2">
                            <span>📱</span>
                            <p>Configure notificações push para lembretes urgentes</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span>⏰</span>
                            <p>Use antecedência de 1 dia para consultas importantes</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span>🔄</span>
                            <p>Ative lembretes recorrentes para medicações diárias</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span>📧</span>
                            <p>Configure email como backup para casos importantes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Informações sobre PWA */}
                <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-green-900 mb-3">🚀 Melhor Experiência com PWA:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <h4 className="font-medium mb-2">📲 Instale o App</h4>
                        <p>Adicione o Senhor Sorriso à sua tela inicial para acesso rápido e notificações nativas</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🔔 Permissões de Notificação</h4>
                        <p>Autorize notificações para receber lembretes mesmo com o app fechado</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">📴 Funciona Offline</h4>
                        <p>Gerencie seus lembretes mesmo sem conexão com a internet</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🔄 Sincronização Automática</h4>
                        <p>Seus lembretes são sincronizados automaticamente entre todos os dispositivos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedRemindersPage;
