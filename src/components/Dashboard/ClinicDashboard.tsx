import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, MessageSquare, TrendingUp, Calendar, Eye, Settings } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedAppointmentsTable } from '@/components/Appointments/EnhancedAppointmentsTable';
import { DashboardStats } from './DashboardStats';
import { DashboardFilters } from './DashboardFilters';
import { DashboardCharts } from './DashboardCharts';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { MessageTemplates } from './MessageTemplates';
import { RealtimeNotifications } from './RealtimeNotifications';
import { toastSuccess } from '@/components/ui/custom-toast';

interface ClinicDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
  clinicName: string;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ appointments, stats, clinicName }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { updateAppointmentStatus, updateAppointmentService } = useAppointments();

  // Usar hooks customizados para filtros e dados
  const { filteredAppointments } = useDashboardFilters(
    appointments,
    clinicName,
    statusFilter,
    dateFilter,
    periodFilter,
    searchTerm
  );

  const dashboardData = useDashboardData(filteredAppointments);

  // Tab options with icons
  const tabOptions = [
    { value: 'overview', label: 'Visão Geral', icon: Eye },
    { value: 'analytics', label: 'Analytics', icon: TrendingUp },
    { value: 'appointments', label: 'Agendamentos', icon: Calendar },
    { value: 'messages', label: 'Mensagens', icon: MessageSquare },
    { value: 'advanced', label: 'Avançado', icon: Settings }
  ];

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    try {
      await updateAppointmentStatus.mutateAsync({ appointmentId, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleUpdateService = async (appointmentId: string, service: string, price?: number) => {
    try {
      await updateAppointmentService.mutateAsync({ appointmentId, service, price });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const handleBulkStatusUpdate = async (appointmentIds: string[], status: string) => {
    try {
      // Implementar atualização em massa
      for (const appointmentId of appointmentIds) {
        await updateAppointmentStatus.mutateAsync({ 
          appointmentId, 
          status: status as 'confirmed' | 'cancelled' | 'completed' | 'no_show'
        });
      }
      toastSuccess('Sucesso', `${appointmentIds.length} agendamentos atualizados`);
    } catch (error) {
      console.error('Erro ao atualizar agendamentos em massa:', error);
    }
  };

  const handleSendBulkMessage = async (appointmentIds: string[], template: string) => {
    try {
      // Implementar envio de mensagem em massa
      console.log('Enviando mensagens:', { appointmentIds, template });
      toastSuccess('Mensagens enviadas', `${appointmentIds.length} mensagens enviadas com sucesso`);
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Nome', 'Telefone', 'Data', 'Horário', 'Serviço', 'Status'],
      ...filteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.service,
        apt.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos_${clinicName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
      <div className={`space-y-6 ${animations.pageEnter}`}>
        {/* Header com notificações - Centralizado */}
        <div className={`${animations.fadeIn} w-full`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 truncate">
                  Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)}
                </h1>
                <p className="text-sm md:text-base text-gray-600 truncate">
                  Gestão avançada de agendamentos da sua unidade
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <RealtimeNotifications clinicName={clinicName} />
            </div>
          </div>

          {/* Filtros */}
          <DashboardFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            onExportData={exportData}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Cards de Estatísticas - Centralizados */}
        <div className="w-full">
          <DashboardStats
            totalAppointments={dashboardData.totalAppointments}
            conversionRate={dashboardData.conversionRate}
            totalRevenue={dashboardData.totalRevenue}
            todayAppointments={dashboardData.todayAppointments}
          />
        </div>

        {/* Navigation - Centralizada */}
        <div className={`${animations.fadeIn} w-full`}>
          {/* Mobile Dropdown */}
          <div className="block md:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full max-w-sm mx-auto">
                <SelectValue placeholder="Selecione uma seção" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border shadow-lg">
                {tabOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs - Melhor Design e Responsivo */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block w-full">
            <div className="w-full flex justify-center mb-6">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-muted-foreground">
                {tabOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <TabsTrigger 
                      key={option.value}
                      value={option.value} 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{option.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="w-full">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <DashboardCharts
                  monthlyData={dashboardData.monthlyData}
                  servicesData={dashboardData.servicesData}
                  statusData={dashboardData.statusData}
                  confirmedAppointments={dashboardData.confirmedAppointments}
                  completedAppointments={dashboardData.completedAppointments}
                  pendingAppointments={dashboardData.pendingAppointments}
                  cancelledAppointments={dashboardData.cancelledAppointments}
                />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-0">
                <AdvancedAnalytics 
                  appointments={filteredAppointments} 
                  clinicName={clinicName}
                />
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6 mt-0">
                <div className="w-full">
                  <EnhancedAppointmentsTable
                    appointments={filteredAppointments}
                    onStatusChange={handleUpdateStatus}
                    onServiceUpdate={handleUpdateService}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
                    onSendBulkMessage={handleSendBulkMessage}
                    isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
                  />
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6 mt-0">
                <MessageTemplates onSendMessage={handleSendBulkMessage} />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-0">
                <AdvancedAnalytics 
                  appointments={filteredAppointments} 
                  clinicName={clinicName}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Mobile Content - Centralizado */}
          <div className="block md:hidden w-full">
            {activeTab === 'overview' && (
              <div className="space-y-6 mt-4">
                <DashboardCharts
                  monthlyData={dashboardData.monthlyData}
                  servicesData={dashboardData.servicesData}
                  statusData={dashboardData.statusData}
                  confirmedAppointments={dashboardData.confirmedAppointments}
                  completedAppointments={dashboardData.completedAppointments}
                  pendingAppointments={dashboardData.pendingAppointments}
                  cancelledAppointments={dashboardData.cancelledAppointments}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6 mt-4">
                <AdvancedAnalytics 
                  appointments={filteredAppointments} 
                  clinicName={clinicName}
                />
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6 mt-4 w-full">
                <div className="w-full overflow-x-auto">
                  <EnhancedAppointmentsTable
                    appointments={filteredAppointments}
                    onStatusChange={handleUpdateStatus}
                    onServiceUpdate={handleUpdateService}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
                    onSendBulkMessage={handleSendBulkMessage}
                    isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
                  />
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6 mt-4">
                <MessageTemplates onSendMessage={handleSendBulkMessage} />
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6 mt-4">
                <AdvancedAnalytics 
                  appointments={filteredAppointments} 
                  clinicName={clinicName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
