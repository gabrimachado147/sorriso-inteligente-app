
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';
import { useMasterDashboardData } from '@/hooks/useMasterDashboardData';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { MasterDashboardStats } from './MasterDashboardStats';
import { MasterDashboardFilters } from './MasterDashboardFilters';
import { MasterDashboardCharts } from './MasterDashboardCharts';

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
  const finalFilteredAppointments = React.useMemo(() => {
    if (periodFilter === 'all') return filteredAppointments;
    
    const today = new Date();
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      
      switch (periodFilter) {
        case 'today':
          return aptDate.toDateString() === today.toDateString();
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return aptDate.toDateString() === yesterday.toDateString();
        }
        case 'week': {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return aptDate >= startOfWeek;
        }
        case 'last_week': {
          const startOfLastWeek = new Date(today);
          startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
          const endOfLastWeek = new Date(startOfLastWeek);
          endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
          return aptDate >= startOfLastWeek && aptDate <= endOfLastWeek;
        }
        case 'month': {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return aptDate >= startOfMonth;
        }
        case 'last_month': {
          const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          return aptDate >= startOfLastMonth && aptDate <= endOfLastMonth;
        }
        case 'quarter': {
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const startOfQuarter = new Date(today.getFullYear(), currentQuarter * 3, 1);
          return aptDate >= startOfQuarter;
        }
        case 'last_quarter': {
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
          const yearForLastQuarter = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
          const startOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3, 1);
          const endOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3 + 3, 0);
          return aptDate >= startOfLastQuarter && aptDate <= endOfLastQuarter;
        }
        case 'year': {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return aptDate >= startOfYear;
        }
        case 'last_year': {
          const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
          const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
          return aptDate >= startOfLastYear && aptDate <= endOfLastYear;
        }
        default:
          return true;
      }
    });
  }, [filteredAppointments, periodFilter]);

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
      <div className={`${animations.fadeIn}`}>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 text-purple-600">
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

      {/* Cards de Estatísticas */}
      <MasterDashboardStats
        totalAppointments={dashboardData.totalAppointments}
        totalClinics={dashboardData.totalClinics}
        totalRevenue={dashboardData.totalRevenue}
        conversionRate={dashboardData.conversionRate}
      />

      {/* Tabs */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MasterDashboardCharts
            clinicStats={dashboardData.clinicStats}
            monthlyTrend={dashboardData.monthlyTrend}
            serviceDistribution={dashboardData.serviceDistribution}
            statusBreakdown={dashboardData.statusBreakdown}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <MasterDashboardCharts
            clinicStats={dashboardData.clinicStats}
            monthlyTrend={dashboardData.monthlyTrend}
            serviceDistribution={dashboardData.serviceDistribution}
            statusBreakdown={dashboardData.statusBreakdown}
          />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <AppointmentsTable
            appointments={finalFilteredAppointments}
            onStatusChange={handleUpdateStatus}
            onServiceUpdate={handleUpdateService}
            isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
