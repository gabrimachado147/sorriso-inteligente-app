
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { EnhancedAppointmentsTable } from '@/components/Appointments/EnhancedAppointmentsTable';
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
  onServiceUpdate: (appointmentId: string, service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => void;
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
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <MasterDashboardStats
        totalAppointments={dashboardData.totalAppointments}
        totalClinics={dashboardData.totalClinics}
        totalRevenue={dashboardData.totalRevenue}
        conversionRate={dashboardData.conversionRate}
      />

      {/* Tabs com layout responsivo */}
      <div className={`${animations.fadeIn} w-full`}>
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center w-full mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-0">
            <MasterDashboardCharts
              clinicStats={dashboardData.clinicStats}
              monthlyTrend={dashboardData.monthlyTrend}
              serviceDistribution={dashboardData.serviceDistribution}
              statusBreakdown={dashboardData.statusBreakdown}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-0">
            <MasterDashboardCharts
              clinicStats={dashboardData.clinicStats}
              monthlyTrend={dashboardData.monthlyTrend}
              serviceDistribution={dashboardData.serviceDistribution}
              statusBreakdown={dashboardData.statusBreakdown}
            />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6 mt-0">
            <EnhancedAppointmentsTable
              appointments={finalFilteredAppointments}
              onStatusChange={onStatusChange}
              onServiceUpdate={onServiceUpdate}
              onBulkStatusUpdate={(appointmentIds, status) => {
                appointmentIds.forEach(id => onStatusChange(id, status as 'confirmed' | 'cancelled' | 'completed' | 'no_show'));
              }}
              onSendBulkMessage={(appointmentIds, template) => {
                console.log('Enviando mensagem em lote:', { appointmentIds, template });
              }}
              isUpdating={isUpdating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
