
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsSection } from './AppointmentsSection';
import { StatsCards } from './StatsCards';
import { ClinicFilter } from './ClinicFilter';
import { AnalyticsTab } from './AnalyticsTab';
import { DashboardHeader } from './DashboardHeader';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';

export const AdminDashboard = () => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Obter informações do usuário logado
  const loggedInUser = sessionStorage.getItem('staffClinic');
  const isMasterUser = loggedInUser === 'gerencia-ss';

  const { 
    appointments, 
    isLoading, 
    stats, 
    statsLoading, 
    refetch 
  } = useAppointments();
  
  // Usar apenas um hook realtime para prevenir conflitos
  const { realtimeConnected } = useRealtimeAppointments();

  // Usar o hook de filtros com as informações do usuário
  const {
    filteredAppointments,
    availableClinics,
    userClinicName
  } = useAppointmentsFilters({
    appointments,
    loggedInUser,
    searchTerm,
    selectedClinic,
    selectedStatus,
    selectedDate
  });

  const handleManualRefresh = () => {
    console.log('[Admin Dashboard] Manual refresh triggered');
    refetch();
  };

  // Log status da conexão realtime
  useEffect(() => {
    console.log('[Admin Dashboard] Realtime connection status:', realtimeConnected);
  }, [realtimeConnected]);

  // Log informações do usuário e dados filtrados
  useEffect(() => {
    console.log('[Admin Dashboard] User access level:', {
      loggedInUser,
      isMasterUser,
      userClinicName,
      availableClinicsCount: availableClinics.length,
      totalAppointments: appointments.length,
      filteredAppointments: filteredAppointments.length
    });
  }, [loggedInUser, isMasterUser, userClinicName, availableClinics, appointments, filteredAppointments]);

  // Debug: Log de todos os agendamentos para análise
  useEffect(() => {
    if (appointments.length > 0) {
      console.log('[Admin Dashboard] All appointments clinics:', 
        appointments.map(apt => ({ id: apt.id.slice(0, 8), clinic: apt.clinic, name: apt.name }))
      );
    }
  }, [appointments]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        realtimeConnected={realtimeConnected}
        isLoading={isLoading}
        onManualRefresh={handleManualRefresh}
        userInfo={{
          isMasterUser,
          clinicName: userClinicName
        }}
      />

      <StatsCards
        stats={stats}
        statsLoading={statsLoading}
        filteredAppointmentsCount={filteredAppointments.length}
      />

      {/* Mostrar filtro de clínica apenas para usuários master com múltiplas clínicas */}
      {isMasterUser && availableClinics.length > 1 && (
        <ClinicFilter
          selectedClinic={selectedClinic}
          onClinicChange={setSelectedClinic}
          availableClinics={['all', ...availableClinics]}
        />
      )}

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">
            Agendamentos {isMasterUser ? '(Todas as Unidades)' : `(${userClinicName || 'Sua Unidade'})`}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
