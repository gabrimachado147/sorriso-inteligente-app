
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { LoadingMicroInteraction } from '@/components/ui/loading-micro-interaction';
import { 
  Shield,
  Users,
  Calendar,
  BarChart3,
  Settings,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { animations } from '@/lib/animations';

const EnhancedAdminPage = () => {
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Painel Admin', href: '/admin', icon: Shield, current: true }
  ];

  const stats = [
    {
      title: 'Consultas Hoje',
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Pacientes Ativos',
      value: '1,234',
      change: '+5%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.2K',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: '87%',
      change: '+3%',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      type: 'appointment',
      message: 'Nova consulta agendada - Dr. Silva',
      time: '2 min atrás',
      status: 'success'
    },
    {
      type: 'alert',
      message: 'Equipamento necessita manutenção',
      time: '15 min atrás',
      status: 'warning'
    },
    {
      type: 'patient',
      message: 'Novo paciente cadastrado',
      time: '1 hora atrás',
      status: 'info'
    }
  ];

  return (
    <>
      <PageHead
        title="Painel Administrativo - Senhor Sorriso"
        description="Central de controle e gerenciamento do sistema Senhor Sorriso. Monitore operações, relatórios e configurações."
        keywords="admin, painel administrativo, gestão, relatórios, clínicas, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/admin"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header com Status */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <Shield className="h-8 w-8 text-primary" />
                      Painel Administrativo
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Central de controle e monitoramento do sistema
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sistema Online
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Última sync: agora
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    
                    return (
                      <Card 
                        key={stat.title}
                        className={`${animations.scaleIn} hover:shadow-lg transition-all duration-300`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                              <p className="text-sm text-green-600">
                                {stat.change} vs. mês anterior
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar com Atividades Recentes */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card className={animations.fadeInUp}>
                      <CardHeader>
                        <CardTitle className="text-lg">Atividades Recentes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {recentActivities.map((activity, index) => (
                          <div 
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              activity.status === 'success' ? 'bg-green-500' :
                              activity.status === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <FeedbackSystem 
                      pageContext="Painel Administrativo"
                      onSubmit={(feedback) => {
                        console.log('Feedback Admin:', feedback);
                      }}
                    />
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="overview" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span className="hidden sm:inline">Visão Geral</span>
                        </TabsTrigger>
                        <TabsTrigger value="appointments" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="hidden sm:inline">Consultas</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Usuários</span>
                        </TabsTrigger>
                        <TabsTrigger value="clinics" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="hidden sm:inline">Clínicas</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline">Config</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className={animations.fadeInUp}>
                            <CardHeader>
                              <CardTitle>Performance Mensal</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Gráfico de Performance</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={animations.fadeInUp}>
                            <CardHeader>
                              <CardTitle>Top Serviços</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {['Limpeza', 'Clareamento', 'Ortodontia', 'Implante'].map((service, index) => (
                                  <div key={service} className="flex items-center justify-between">
                                    <span className="text-sm">{service}</span>
                                    <Badge variant="secondary">{100 - index * 15}%</Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="appointments">
                        <Card className={animations.fadeInUp}>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Gerenciar Consultas</CardTitle>
                            <Button 
                              className={animations.buttonHover}
                              onClick={() => {
                                setLoading(true);
                                setTimeout(() => setLoading(false), 2000);
                              }}
                            >
                              {loading ? (
                                <LoadingMicroInteraction size="sm" className="mr-2" />
                              ) : (
                                <Calendar className="h-4 w-4 mr-2" />
                              )}
                              Nova Consulta
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Interface de gerenciamento de consultas.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="users">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Gerenciar Usuários</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Interface de gerenciamento de usuários.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="clinics">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Gerenciar Clínicas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Interface de gerenciamento de clínicas.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="settings">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Configurações do Sistema</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Configurações gerais do sistema.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedAdminPage;
