
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
  
  // Only use one realtime hook to prevent conflicts
  const { realtimeConnected } = useRealtimeAppointments();

  // Get logged in user from session storage
  const loggedInUser = sessionStorage.getItem('staffClinic');
  const isMasterUser = loggedInUser === 'gerencia-ss';

  // Filter appointments by selected clinic and user permissions
  const filteredAppointments = React.useMemo(() => {
    let filtered = appointments;

    // If not master user, only show appointments for their clinic
    if (!isMasterUser && loggedInUser) {
      const clinicMapping: Record<string, string> = {
        'capao-bonito': 'Senhor Sorriso Capão Bonito',
        'campo-belo': 'Senhor Sorriso Campo Belo',
        'itapeva': 'Senhor Sorriso Itapeva',
        'itarare': 'Senhor Sorriso Itararé',
        'formiga': 'Senhor Sorriso Formiga'
      };

      const userClinicName = clinicMapping[loggedInUser];
      if (userClinicName) {
        filtered = filtered.filter(apt => 
          apt.clinic.includes(userClinicName) || 
          apt.clinic === userClinicName ||
          apt.clinic_filter === loggedInUser
        );
      }
    } else if (selectedClinic !== 'all') {
      // Master user can filter by any clinic
      filtered = filtered.filter(apt => 
        apt.clinic_filter === selectedClinic || apt.clinic.includes(selectedClinic)
      );
    }

    return filtered;
  }, [appointments, selectedClinic, loggedInUser, isMasterUser]);

  // Available clinics based on user permissions
  const availableClinics = React.useMemo(() => {
    if (isMasterUser) {
      // Master user can see all clinics
      return [
        'all',
        'Senhor Sorriso Capão Bonito',
        'Senhor Sorriso Campo Belo', 
        'Senhor Sorriso Itapeva',
        'Senhor Sorriso Itararé',
        'Senhor Sorriso Formiga'
      ];
    } else if (loggedInUser) {
      // Regular users only see their clinic
      const clinicMapping: Record<string, string> = {
        'capao-bonito': 'Senhor Sorriso Capão Bonito',
        'campo-belo': 'Senhor Sorriso Campo Belo',
        'itapeva': 'Senhor Sorriso Itapeva',
        'itarare': 'Senhor Sorriso Itararé',
        'formiga': 'Senhor Sorriso Formiga'
      };
      
      const userClinicName = clinicMapping[loggedInUser];
      return userClinicName ? [userClinicName] : [];
    }
    
    return ['all'];
  }, [isMasterUser, loggedInUser]);

  const handleManualRefresh = () => {
    console.log('[Admin Dashboard] Manual refresh triggered');
    refetch();
  };

  // Log realtime status changes
  useEffect(() => {
    console.log('[Admin Dashboard] Realtime connection status:', realtimeConnected);
  }, [realtimeConnected]);

  // Set initial clinic selection for non-master users
  useEffect(() => {
    if (!isMasterUser && loggedInUser && availableClinics.length > 0) {
      setSelectedClinic(availableClinics[0]);
    }
  }, [isMasterUser, loggedInUser, availableClinics]);

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

      {/* Only show clinic filter for master users or if there are multiple clinics */}
      {(isMasterUser || availableClinics.length > 1) && (
        <ClinicFilter
          selectedClinic={selectedClinic}
          onClinicChange={setSelectedClinic}
          availableClinics={availableClinics}
        />
      )}

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
