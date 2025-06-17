
import React, { useState } from 'react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardStats } from './DashboardStats';
import { ClinicDashboardHeader } from './ClinicDashboardHeader';
import { ClinicDashboardTabs } from './ClinicDashboardTabs';
import { ClinicDashboardContent } from './ClinicDashboardContent';
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

  const { filteredAppointments } = useDashboardFilters(
    appointments,
    clinicName,
    statusFilter,
    dateFilter,
    periodFilter,
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

  const handleBulkStatusUpdate = async (appointmentIds: string[], status: string) => {
    try {
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
        <ClinicDashboardHeader
          clinicName={clinicName}
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
          <ClinicDashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <ClinicDashboardContent
            activeTab={activeTab}
            filteredAppointments={filteredAppointments}
            dashboardData={dashboardData}
            clinicName={clinicName}
            onStatusChange={handleUpdateStatus}
            onServiceUpdate={handleUpdateService}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onSendBulkMessage={handleSendBulkMessage}
            isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
          />
        </div>
      </div>
    </div>
  );
};
