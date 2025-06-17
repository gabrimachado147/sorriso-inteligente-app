
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3 } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { DashboardStats } from './DashboardStats';
import { DashboardFilters } from './DashboardFilters';
import { DashboardCharts } from './DashboardCharts';

interface ClinicDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
  clinicName: string;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ appointments, stats, clinicName }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateAppointmentStatus, updateAppointmentService } = useAppointments();

  // Usar hooks customizados para filtros e dados
  const { filteredAppointments } = useDashboardFilters(
    appointments,
    clinicName,
    statusFilter,
    dateFilter,
    searchTerm
  );

  const dashboardData = useDashboardData(filteredAppointments);

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
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn}`}>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 text-blue-600">
          <BarChart3 className="h-8 w-8" />
          Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)} 🏥
        </h1>
        <p className="text-gray-600 mb-6">Gestão de agendamentos da sua unidade</p>

        {/* Filtros */}
        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
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

      {/* Tabs */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

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

        <TabsContent value="appointments" className="space-y-6">
          <AppointmentsTable
            appointments={filteredAppointments}
            onStatusChange={handleUpdateStatus}
            onServiceUpdate={handleUpdateService}
            isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
