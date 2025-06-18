
import React, { useState, useEffect } from 'react';
import { Crown, Settings, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';
import { useMasterDashboardData } from '@/hooks/useMasterDashboardData';
import { useMasterDashboardFilters } from '@/hooks/useMasterDashboardFilters';
import { MasterDashboardFilters } from './MasterDashboardFilters';
import { MasterDashboardContent } from './MasterDashboardContent';
import { DynamicKPIs } from './DynamicKPIs';
import { RealtimeNotifications, Notification } from './RealtimeNotifications';
import { AdvancedCharts } from './AdvancedCharts';
import { ReportGenerator, defaultReportTemplates } from './ReportGenerator';
import { MessageTemplates } from './MessageTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedMasterDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const EnhancedMasterDashboard: React.FC<EnhancedMasterDashboardProps> = ({ 
  appointments, 
  stats 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const { updateAppointmentStatus, updateAppointmentService } = useAppointments();

  // Usar hook de filtros para master dashboard
  const { filteredAppointments, availableClinics } = useAppointmentsFilters({
    appointments,
    loggedInUser: 'gerencia-ss',
    searchTerm,
    selectedClinic,
    selectedStatus,
    selectedDate
  });

  // Aplicar filtro adicional de período
  const finalFilteredAppointments = useMasterDashboardFilters({
    filteredAppointments,
    periodFilter
  });

  // Usar hook customizado para dados do dashboard
  const dashboardData = useMasterDashboardData(finalFilteredAppointments);

  // KPIs dinâmicos
  const dynamicKPIs = [
    {
      id: 'total-appointments',
      title: 'Total de Agendamentos',
      value: dashboardData.totalAppointments,
      previousValue: dashboardData.totalAppointments - 50,
      icon: Calendar,
      color: 'text-blue-600',
      trend: 'up' as const,
      description: 'Todos os agendamentos'
    },
    {
      id: 'total-clinics',
      title: 'Clínicas Ativas',
      value: dashboardData.totalClinics,
      icon: Users,
      color: 'text-green-600',
      description: 'Unidades operando'
    },
    {
      id: 'total-revenue',
      title: 'Receita Total',
      value: dashboardData.totalRevenue,
      previousValue: dashboardData.totalRevenue - 5000,
      format: 'currency' as const,
      icon: DollarSign,
      color: 'text-purple-600',
      trend: 'up' as const,
      description: 'Receita acumulada'
    },
    {
      id: 'conversion-rate',
      title: 'Taxa de Conversão',
      value: dashboardData.conversionRate,
      previousValue: dashboardData.conversionRate - 2,
      format: 'percentage' as const,
      icon: Target,
      color: 'text-orange-600',
      trend: 'up' as const,
      description: 'Agendamentos confirmados'
    }
  ];

  // Gráficos avançados
  const advancedCharts = [
    {
      id: 'revenue-trend',
      title: 'Tendência de Receita',
      type: 'area' as const,
      data: dashboardData.monthlyTrend,
      dataKeys: ['receita'],
      colors: ['#8b5cf6'],
      description: 'Evolução da receita ao longo do tempo'
    },
    {
      id: 'appointments-trend',
      title: 'Agendamentos por Período',
      type: 'line' as const,
      data: dashboardData.monthlyTrend,
      dataKeys: ['agendamentos', 'conversoes'],
      colors: ['#3b82f6', '#10b981'],
      description: 'Comparação entre agendamentos e conversões'
    },
    {
      id: 'services-distribution',
      title: 'Distribuição de Serviços',
      type: 'pie' as const,
      data: dashboardData.serviceDistribution,
      dataKeys: ['value'],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      description: 'Serviços mais solicitados'
    },
    {
      id: 'status-breakdown',
      title: 'Status dos Agendamentos',
      type: 'bar' as const,
      data: dashboardData.statusBreakdown,
      dataKeys: ['value'],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      description: 'Distribuição por status'
    }
  ];

  // Simular notificações em tempo real
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Nova Meta Atingida',
        message: 'A clínica de Itapeva atingiu 95% de taxa de conversão!',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        actionable: true,
        actionLabel: 'Ver Detalhes'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Alerta de Capacidade',
        message: 'A clínica de Campo Belo está com 90% da capacidade ocupada.',
        timestamp: new Date(Date.now() - 600000),
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: 'Relatório Disponível',
        message: 'O relatório mensal de performance foi gerado com sucesso.',
        timestamp: new Date(Date.now() - 900000),
        read: true
      }
    ];
    setNotifications(initialNotifications);
  }, []);

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    try {
      await updateAppointmentStatus.mutateAsync({ appointmentId, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleUpdateService = async (appointmentId: string, service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => {
    try {
      await updateAppointmentService.mutateAsync({ 
        appointmentId, 
        service, 
        price, 
        originalPrice, 
        discountPercent, 
        paymentMethod 
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const handleGenerateReport = async (config: any) => {
    setIsGeneratingReport(true);
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Adicionar notificação de sucesso
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'success',
        title: 'Relatório Gerado',
        message: `O relatório "${config.name}" foi gerado com sucesso.`,
        timestamp: new Date(),
        read: false,
        actionable: true,
        actionLabel: 'Download'
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleNotificationAction = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const exportData = () => {
    const csvContent = [
      ['Nome', 'Telefone', 'Data', 'Horário', 'Serviço', 'Status', 'Clínica', 'Observações'],
      ...finalFilteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.service,
        apt.status,
        apt.clinic,
        apt.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos_master_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`space-y-6 w-full overflow-x-hidden ${animations.pageEnter}`}>
      {/* Header com Notificações */}
      <div className={`${animations.fadeIn} text-center`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold flex items-center gap-3 text-purple-600">
            <Crown className="h-8 w-8" />
            Dashboard Master - Gestão Inteligente 👑
          </h1>
          <RealtimeNotifications
            notifications={notifications}
            onMarkAsRead={handleNotificationAction}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDismiss={handleDismissNotification}
          />
        </div>
        <p className="text-gray-600 mb-6">Visão completa de todas as unidades com insights inteligentes</p>

        {/* Filtros */}
        <div className="w-full overflow-x-hidden">
          <MasterDashboardFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedClinic={selectedClinic}
            setSelectedClinic={setSelectedClinic}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            availableClinics={availableClinics}
            onExportData={exportData}
            onRefresh={handleRefresh}
            onShowMessages={() => {}}
          />
        </div>
      </div>

      {/* KPIs Dinâmicos */}
      <DynamicKPIs kpis={dynamicKPIs} />

      {/* Tabs com Funcionalidades Avançadas */}
      <div className={`${animations.fadeIn} w-full`}>
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col items-center w-full mb-6">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1 text-muted-foreground shadow-sm border w-auto min-w-[320px] sm:min-w-[500px] md:min-w-[600px]">
              <TabsTrigger value="overview" className="flex-1 min-w-[80px]">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 min-w-[80px]">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1 min-w-[80px]">
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex-1 min-w-[80px]">
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-1 min-w-[80px]">
                Mensagens
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-0">
            <MasterDashboardContent
              dashboardData={dashboardData}
              finalFilteredAppointments={finalFilteredAppointments}
              onStatusChange={handleUpdateStatus}
              onServiceUpdate={handleUpdateService}
              isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-0">
            <AdvancedCharts charts={advancedCharts} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-0">
            <ReportGenerator
              templates={defaultReportTemplates}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGeneratingReport}
            />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6 mt-0">
            <MasterDashboardContent
              dashboardData={dashboardData}
              finalFilteredAppointments={finalFilteredAppointments}
              onStatusChange={handleUpdateStatus}
              onServiceUpdate={handleUpdateService}
              isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
            />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 mt-0">
            <MessageTemplates 
              appointments={finalFilteredAppointments}
              onSendMessage={(appointmentIds, template) => {
                console.log('Enviando mensagem:', { appointmentIds, template });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
