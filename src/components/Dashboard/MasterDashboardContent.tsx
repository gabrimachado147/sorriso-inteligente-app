
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { MasterDashboardStats } from './MasterDashboardStats';
import { MasterDashboardCharts } from './MasterDashboardCharts';
import { animations } from '@/lib/animations';

interface MasterDashboardContentProps {
  dashboardData: {
    totalAppointments: number;
    totalClinics: number;
    totalRevenue: number;
    conversionRate: number;
    clinicStats: Array<{
      name: string;
      appointments: number;
      confirmed: number;
      revenue: number;
      conversionRate: number;
    }>;
    monthlyTrend: Array<{ month: string; agendamentos: number; conversoes: number; receita: number }>;
    serviceDistribution: Array<{ name: string; value: number; color: string }>;
    statusBreakdown: Array<{ name: string; value: number; color: string }>;
  };
  finalFilteredAppointments: AppointmentRecord[];
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  isUpdating: boolean;
}

export const MasterDashboardContent: React.FC<MasterDashboardContentProps> = ({
  dashboardData,
  finalFilteredAppointments,
  onStatusChange,
  onServiceUpdate,
  isUpdating
}) => {
  return (
    <>
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
            onStatusChange={onStatusChange}
            onServiceUpdate={onServiceUpdate}
            isUpdating={isUpdating}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
