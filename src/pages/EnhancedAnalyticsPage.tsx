
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { AdvancedCharts } from '@/components/Dashboard/AdvancedCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react';
import { animations } from '@/lib/animations';
import { MicroInteraction } from '@/components/ui/micro-interactions';

const EnhancedAnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedClinic, setSelectedClinic] = useState('all');

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Relatórios', href: '/analytics', icon: BarChart3 }
  ];

  // Dados mock para os gráficos
  const chartConfigs = [
    {
      id: 'appointments',
      title: 'Agendamentos por Período',
      type: 'line' as const,
      data: [
        { name: 'Jan', agendamentos: 65, cancelamentos: 8 },
        { name: 'Fev', agendamentos: 78, cancelamentos: 12 },
        { name: 'Mar', agendamentos: 90, cancelamentos: 5 },
        { name: 'Abr', agendamentos: 95, cancelamentos: 7 },
        { name: 'Mai', agendamentos: 88, cancelamentos: 9 }
      ],
      dataKeys: ['agendamentos', 'cancelamentos'],
      colors: ['#3b82f6', '#ef4444'],
      description: 'Evolução de agendamentos e cancelamentos ao longo do tempo'
    },
    {
      id: 'services',
      title: 'Serviços Mais Procurados',
      type: 'bar' as const,
      data: [
        { name: 'Limpeza', quantidade: 145 },
        { name: 'Ortodontia', quantidade: 89 },
        { name: 'Implantes', quantidade: 67 },
        { name: 'Clareamento', quantidade: 45 },
        { name: 'Emergência', quantidade: 23 }
      ],
      dataKeys: ['quantidade'],
      colors: ['#10b981'],
      description: 'Distribuição dos serviços mais solicitados'
    },
    {
      id: 'clinics',
      title: 'Performance por Clínica',
      type: 'pie' as const,
      data: [
        { name: 'Campo Belo', valor: 45 },
        { name: 'Formiga', valor: 35 },
        { name: 'Itararé', valor: 20 }
      ],
      dataKeys: ['valor'],
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      description: 'Distribuição de atendimentos por unidade'
    },
    {
      id: 'satisfaction',
      title: 'Satisfação dos Pacientes',
      type: 'area' as const,
      data: [
        { name: 'Sem', satisfacao: 4.2, nps: 85 },
        { name: '2Sem', satisfacao: 4.4, nps: 88 },
        { name: '3Sem', satisfacao: 4.6, nps: 92 },
        { name: '4Sem', satisfacao: 4.8, nps: 95 }
      ],
      dataKeys: ['satisfacao', 'nps'],
      colors: ['#8b5cf6', '#06b6d4'],
      description: 'Evolução da satisfação e NPS dos pacientes'
    }
  ];

  const kpiData = [
    {
      title: 'Total de Pacientes',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Consultas Este Mês',
      value: '324',
      change: '+8%',
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'Taxa de Satisfação',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 89.5k',
      change: '+15%',
      trend: 'up',
      icon: BarChart3
    }
  ];

  const handleExportReport = () => {
    console.log('Exportando relatório...', { selectedPeriod, selectedClinic });
  };

  return (
    <>
      <PageHead
        title="Analytics e Relatórios - Senhor Sorriso"
        description="Acompanhe métricas de performance, satisfação dos pacientes e insights de negócio das clínicas Senhor Sorriso."
        keywords="analytics, relatórios, métricas, dashboard, performance, satisfação pacientes, KPIs, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/analytics"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <BarChart3 className="h-8 w-8 text-primary" />
                      Analytics & Relatórios
                    </h1>
                    <p className="text-muted-foreground">
                      Insights detalhados sobre performance e satisfação dos pacientes
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Clínicas</SelectItem>
                        <SelectItem value="campo-belo">Campo Belo</SelectItem>
                        <SelectItem value="formiga">Formiga</SelectItem>
                        <SelectItem value="itarare">Itararé</SelectItem>
                      </SelectContent>
                    </Select>

                    <MicroInteraction type="click-ripple" trigger="click">
                      <Button onClick={handleExportReport} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Relatório
                      </Button>
                    </MicroInteraction>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpiData.map((kpi, index) => {
                    const IconComponent = kpi.icon;
                    return (
                      <MicroInteraction key={index} type="hover-lift" trigger="hover">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  {kpi.title}
                                </p>
                                <p className="text-2xl font-bold">{kpi.value}</p>
                                <div className="flex items-center mt-1">
                                  <Badge 
                                    className={`${
                                      kpi.trend === 'up' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    {kpi.change}
                                  </Badge>
                                </div>
                              </div>
                              <IconComponent className="h-8 w-8 text-primary" />
                            </div>
                          </CardContent>
                        </Card>
                      </MicroInteraction>
                    );
                  })}
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Gráficos Principais */}
                  <div className="lg:col-span-3">
                    <AdvancedCharts charts={chartConfigs} />
                  </div>

                  {/* Sidebar com Feedback */}
                  <div className="space-y-6">
                    <FeedbackSystem 
                      pageContext="Analytics e Relatórios"
                      onSubmit={(feedback) => {
                        console.log('Feedback Analytics:', feedback);
                      }}
                    />

                    {/* Insights Rápidos */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">💡 Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            📈 Crescimento Positivo
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Agendamentos aumentaram 12% este mês
                          </p>
                        </div>
                        
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">
                            ⭐ Alta Satisfação
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            NPS de 95 pontos - Excelente!
                          </p>
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">
                            🎯 Oportunidade
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Foque em reduzir cancelamentos
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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
