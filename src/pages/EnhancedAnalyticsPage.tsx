
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { LoadingMicroInteraction } from '@/components/ui/loading-micro-interaction';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Share2,
  Filter,
  Eye,
  Activity,
  DollarSign
} from 'lucide-react';
import { animations } from '@/lib/animations';

const EnhancedAnalyticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Analytics', href: '/analytics', icon: BarChart3, current: true }
  ];

  const kpis = [
    {
      title: 'Consultas Realizadas',
      value: '2,543',
      change: '+15.3%',
      period: 'vs. período anterior',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Novos Pacientes',
      value: '487',
      change: '+8.7%',
      period: 'últimos 30 dias',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Taxa de Conversão',
      value: '23.8%',
      change: '+2.1%',
      period: 'agendamentos/visitas',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Receita Média',
      value: 'R$ 285',
      change: '-1.2%',
      period: 'por consulta',
      icon: DollarSign,
      trend: 'down'
    }
  ];

  const topServices = [
    { name: 'Limpeza Dental', sessions: 1234, percentage: 45 },
    { name: 'Clareamento', sessions: 856, percentage: 31 },
    { name: 'Ortodontia', sessions: 423, percentage: 15 },
    { name: 'Implantes', sessions: 267, percentage: 9 }
  ];

  const recentReports = [
    { name: 'Relatório Mensal - Dezembro', date: '2024-01-02', type: 'Mensal' },
    { name: 'Performance por Clínica', date: '2024-01-01', type: 'Operacional' },
    { name: 'Análise de Satisfação', date: '2023-12-30', type: 'Qualidade' }
  ];

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <PageHead
        title="Analytics e Relatórios - Senhor Sorriso"
        description="Dashboard analítico completo com métricas de performance, relatórios detalhados e insights para otimização do negócio."
        keywords="analytics, relatórios, métricas, dashboard, performance, KPIs, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/analytics"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header com Controles */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <BarChart3 className="h-8 w-8 text-primary" />
                      Analytics & Relatórios
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Métricas em tempo real e insights para otimização
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="90d">90 dias</SelectItem>
                        <SelectItem value="1y">1 ano</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExport}
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadingMicroInteraction size="sm" className="mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Exportar
                    </Button>
                  </div>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {kpis.map((kpi, index) => {
                    const IconComponent = kpi.icon;
                    
                    return (
                      <Card 
                        key={kpi.title}
                        className={`${animations.scaleIn} hover:shadow-lg transition-all duration-300 border-l-4 ${
                          kpi.trend === 'up' ? 'border-l-green-500' : 'border-l-red-500'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                {kpi.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900 mb-1">
                                {kpi.value}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={kpi.trend === 'up' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {kpi.change}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {kpi.period}
                                </span>
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg ${
                              kpi.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar com Relatórios Recentes */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card className={animations.fadeInUp}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Relatórios Recentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {recentReports.map((report, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <h4 className="font-medium text-sm text-gray-900 mb-1">
                              {report.name}
                            </h4>
                            <div className="flex items-center justify-between text-xs">
                              <Badge variant="outline" className="text-xs">
                                {report.type}
                              </Badge>
                              <span className="text-gray-500">{report.date}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <FeedbackSystem 
                      pageContext="Dashboard de Analytics"
                      onSubmit={(feedback) => {
                        console.log('Feedback Analytics:', feedback);
                      }}
                    />
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="overview" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span className="hidden sm:inline">Visão Geral</span>
                        </TabsTrigger>
                        <TabsTrigger value="traffic" className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="hidden sm:inline">Tráfego</span>
                        </TabsTrigger>
                        <TabsTrigger value="conversion" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Conversão</span>
                        </TabsTrigger>
                        <TabsTrigger value="revenue" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="hidden sm:inline">Receita</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card className={animations.fadeInUp}>
                            <CardHeader className="flex flex-row items-center justify-between">
                              <CardTitle>Performance Geral</CardTitle>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                                <div className="text-center">
                                  <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                                  <p className="text-gray-600">Gráfico de Performance</p>
                                  <p className="text-sm text-gray-500">Dados em tempo real</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={animations.fadeInUp}>
                            <CardHeader>
                              <CardTitle>Top Serviços</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {topServices.map((service, index) => (
                                  <div 
                                    key={service.name}
                                    className={`${animations.slideInRight}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">{service.name}</span>
                                      <span className="text-sm text-gray-600">{service.sessions}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${service.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="traffic">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Análise de Tráfego</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                              <p className="text-gray-500">Gráfico de Tráfego</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="conversion">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Funil de Conversão</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                              <p className="text-gray-500">Análise de Conversão</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="revenue">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle>Análise de Receita</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                              <p className="text-gray-500">Relatório de Receita</p>
                            </div>
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

export default EnhancedAnalyticsPage;
