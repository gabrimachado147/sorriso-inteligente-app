
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
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Cards de Estatísticas - Removida duplicação */}
      <div className="w-full">
        <MasterDashboardStats
          totalAppointments={dashboardData.totalAppointments}
          totalClinics={dashboardData.totalClinics}
          totalRevenue={dashboardData.totalRevenue}
          conversionRate={dashboardData.conversionRate}
        />
      </div>

      {/* Tabs com layout responsivo e sem overflow */}
      <div className={`${animations.fadeIn} w-full overflow-x-hidden`}>
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center w-full mb-6 overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground min-w-max">
              <TabsTrigger value="overview" className="px-4 py-2 text-sm">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics" className="px-4 py-2 text-sm">Analytics</TabsTrigger>
              <TabsTrigger value="appointments" className="px-4 py-2 text-sm">Agendamentos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-0 w-full overflow-x-hidden">
            <div className="w-full">
              <MasterDashboardCharts
                clinicStats={dashboardData.clinicStats}
                monthlyTrend={dashboardData.monthlyTrend}
                serviceDistribution={dashboardData.serviceDistribution}
                statusBreakdown={dashboardData.statusBreakdown}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-0 w-full overflow-x-hidden">
            <div className="w-full">
              <MasterDashboardCharts
                clinicStats={dashboardData.clinicStats}
                monthlyTrend={dashboardData.monthlyTrend}
                serviceDistribution={dashboardData.serviceDistribution}
                statusBreakdown={dashboardData.statusBreakdown}
              />
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6 mt-0 w-full overflow-x-hidden">
            <div className="w-full">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
