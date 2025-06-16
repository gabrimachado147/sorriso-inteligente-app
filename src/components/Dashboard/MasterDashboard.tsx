
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsSection } from './AppointmentsSection';
import { StatsCards } from './StatsCards';
import { ClinicFilter } from './ClinicFilter';
import { AnalyticsTab } from './AnalyticsTab';
import { DashboardHeader } from './DashboardHeader';
import { MasterStatsOverview } from './MasterStatsOverview';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';

interface MasterDashboardProps {
  userInfo: {
    isMasterUser: boolean;
    clinicName?: string;
  };
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ userInfo }) => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

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
    availableClinics
  } = useAppointmentsFilters({
    appointments,
    loggedInUser,
    searchTerm,
    selectedClinic,
    selectedStatus,
    selectedDate
  });

  const handleManualRefresh = () => {
    console.log('[Master Dashboard] Manual refresh triggered');
    refetch();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        realtimeConnected={realtimeConnected}
        isLoading={isLoading}
        onManualRefresh={handleManualRefresh}
        userInfo={userInfo}
      />

      {/* Visão Geral Master */}
      <MasterStatsOverview
        appointments={appointments}
        stats={stats}
        statsLoading={statsLoading}
      />

      <StatsCards
        stats={stats}
        statsLoading={statsLoading}
        filteredAppointmentsCount={filteredAppointments.length}
      />

      {/* Filtro de clínica para usuários master */}
      {availableClinics.length > 1 && (
        <ClinicFilter
          selectedClinic={selectedClinic}
          onClinicChange={setSelectedClinic}
          availableClinics={['all', ...availableClinics]}
        />
      )}

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">
            Agendamentos (Todas as Unidades)
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics Globais</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <AppointmentsSection 
            appointments={filteredAppointments} 
            selectedClinic={selectedClinic}
            realtimeConnected={realtimeConnected}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab
            stats={stats}
            statsLoading={statsLoading}
            realtimeConnected={realtimeConnected}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
