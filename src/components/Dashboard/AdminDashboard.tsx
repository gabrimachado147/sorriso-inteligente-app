
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsSection } from './AppointmentsSection';
import { StatsCards } from './StatsCards';
import { ClinicFilter } from './ClinicFilter';
import { AnalyticsTab } from './AnalyticsTab';
import { DashboardHeader } from './DashboardHeader';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';

export const AdminDashboard = () => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const { 
    appointments, 
    isLoading, 
    stats, 
    statsLoading, 
    refetch 
  } = useAppointments();
  const { realtimeConnected } = useRealtimeAppointments();

  // Filter appointments by selected clinic
  const filteredAppointments = selectedClinic === 'all' 
    ? appointments 
    : appointments.filter(apt => 
        apt.clinic_filter === selectedClinic || apt.clinic.includes(selectedClinic)
      );

  const availableClinics = [
    'all',
    'Senhor Sorriso Capão Bonito - Capão',
    'Senhor Sorriso Capão Bonito - Centro', 
    'Senhor Sorriso Campobelo',
    'Senhor Sorriso Itapeva',
    'Senhor Sorriso Taquarivaí'
  ];

  const handleManualRefresh = () => {
    console.log('[Admin Dashboard] Manual refresh triggered');
    refetch();
  };

  // Log realtime status changes
  useEffect(() => {
    console.log('[Admin Dashboard] Realtime connection status:', realtimeConnected);
  }, [realtimeConnected]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        realtimeConnected={realtimeConnected}
        isLoading={isLoading}
        onManualRefresh={handleManualRefresh}
      />

      <StatsCards
        stats={stats}
        statsLoading={statsLoading}
        filteredAppointmentsCount={filteredAppointments.length}
      />

      <ClinicFilter
        selectedClinic={selectedClinic}
        onClinicChange={setSelectedClinic}
        availableClinics={availableClinics}
      />

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
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
