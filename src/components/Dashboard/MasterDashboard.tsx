import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';
import { useMasterDashboardData } from '@/hooks/useMasterDashboardData';
import { useMasterDashboardFilters } from '@/hooks/useMasterDashboardFilters';
import { MasterDashboardFilters } from './MasterDashboardFilters';
import { MasterDashboardContent } from './MasterDashboardContent';

interface MasterDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ appointments, stats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  
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
      ['Nome', 'Telefone', 'Data', 'Horário', 'Serviço', 'Status', 'Clínica'],
      ...finalFilteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.service,
        apt.status,
        apt.clinic
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
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn} text-center`}>
        <h1 className="text-lg font-bold flex items-center justify-center gap-3 mb-2 text-purple-600">
          <Crown className="h-8 w-8" />
          Dashboard Master - Gestão Geral 👑
        </h1>
        <p className="text-gray-600 mb-6">Visão completa de todas as unidades e agendamentos</p>

        {/* Filtros */}
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
        />
      </div>

      {/* Conteúdo do Dashboard */}
      <MasterDashboardContent
        dashboardData={dashboardData}
        finalFilteredAppointments={finalFilteredAppointments}
        onStatusChange={handleUpdateStatus}
        onServiceUpdate={handleUpdateService}
        isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
      />
    </div>
  );
};
