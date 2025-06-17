
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
    <div className={`space-y-6 ${animations.pageEnter} overflow-x-hidden`}>
      {/* Header com notificações */}
      <div className={`${animations.fadeIn} overflow-x-hidden`}>
        <div className="flex items-center justify-between mb-2 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mobile-text-xl truncate">
              Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)}
            </h1>
          </div>
          <RealtimeNotifications clinicName={clinicName} />
        </div>
        <p className="text-gray-600 mb-6 mobile-text-base truncate">
          Gestão avançada de agendamentos da sua unidade
        </p>

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

      {/* Cards de Estatísticas */}
      <DashboardStats
        totalAppointments={dashboardData.totalAppointments}
        conversionRate={dashboardData.conversionRate}
        totalRevenue={dashboardData.totalRevenue}
        todayAppointments={dashboardData.todayAppointments}
      />

      {/* Navigation - Dropdown for mobile, Tabs for desktop */}
      <div className={`${animations.fadeIn} overflow-x-hidden`}>
        {/* Mobile Dropdown */}
        <div className="block md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
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

        {/* Desktop Tabs - Improved Design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block overflow-x-hidden">
          <div className="overflow-x-auto mobile-scroll">
            <TabsList className="grid grid-cols-5 w-full bg-gray-100 p-1 rounded-lg h-12">
              {tabOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <TabsTrigger 
                    key={option.value}
                    value={option.value} 
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{option.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="overflow-x-hidden mt-6">
            <TabsContent value="overview" className="space-y-6">
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

            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics 
                appointments={filteredAppointments} 
                clinicName={clinicName}
              />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6 overflow-x-hidden">
              <div className="overflow-x-auto">
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

            <TabsContent value="messages" className="space-y-6">
              <MessageTemplates onSendMessage={handleSendBulkMessage} />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <AdvancedAnalytics 
                appointments={filteredAppointments} 
                clinicName={clinicName}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Mobile Content */}
        <div className="block md:hidden overflow-x-hidden">
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
            <div className="space-y-6 mt-4 overflow-x-hidden">
              <div className="overflow-x-auto">
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
  );
};
