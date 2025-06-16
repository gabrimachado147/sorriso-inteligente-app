
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsSection } from './AppointmentsSection';
import { ClinicStatsCards } from './ClinicStatsCards';
import { AnalyticsTab } from './AnalyticsTab';
import { DashboardHeader } from './DashboardHeader';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';

interface ClinicDashboardProps {
  userInfo: {
    isMasterUser: boolean;
    clinicName?: string;
  };
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ userInfo }) => {
  const loggedInUser = sessionStorage.getItem('staffClinic');

  const { 
    appointments, 
    isLoading, 
    stats, 
    statsLoading, 
    refetch 
  } = useAppointments();
  
  const { realtimeConnected } = useRealtimeAppointments();

  const {
    filteredAppointments,
    userClinicName
  } = useAppointmentsFilters({
    appointments,
    loggedInUser,
    searchTerm: '',
    selectedClinic: 'all',
    selectedStatus: 'all',
    selectedDate: ''
  });

  const handleManualRefresh = () => {
    console.log('[Clinic Dashboard] Manual refresh triggered');
    refetch();
  };

  // Calcular estatísticas específicas da clínica
  const clinicStats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    return {
      total: filteredAppointments.length,
      today: filteredAppointments.filter(apt => apt.date === today).length,
      confirmed: filteredAppointments.filter(apt => apt.status === 'confirmed').length,
      thisMonth: filteredAppointments.filter(apt => apt.created_at.startsWith(thisMonth)).length,
      completed: filteredAppointments.filter(apt => apt.status === 'completed').length,
      cancelled: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
      noShow: filteredAppointments.filter(apt => apt.status === 'no_show').length
    };
  }, [filteredAppointments]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        realtimeConnected={realtimeConnected}
        isLoading={isLoading}
        onManualRefresh={handleManualRefresh}
        userInfo={userInfo}
      />

      <ClinicStatsCards
        stats={clinicStats}
        statsLoading={statsLoading}
        clinicName={userClinicName}
      />

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">
            Agendamentos ({userClinicName})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics da Unidade</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <AppointmentsSection 
            appointments={filteredAppointments} 
            selectedClinic="all"
            realtimeConnected={realtimeConnected}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab
            stats={clinicStats}
            statsLoading={statsLoading}
            realtimeConnected={realtimeConnected}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
