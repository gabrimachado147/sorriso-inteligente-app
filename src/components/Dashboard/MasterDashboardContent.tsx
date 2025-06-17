
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
    <>
      {/* Cards de Estatísticas */}
      <MasterDashboardStats
        totalAppointments={dashboardData.totalAppointments}
        totalClinics={dashboardData.totalClinics}
        totalRevenue={dashboardData.totalRevenue}
        conversionRate={dashboardData.conversionRate}
      />

      {/* Tabs com layout responsivo e espaçamento melhorado */}
      <div className={`${animations.fadeIn} w-full`}>
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col items-center w-full mb-8">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1 text-muted-foreground shadow-sm border w-auto min-w-[320px] sm:min-w-[400px]">
              <TabsTrigger 
                value="overview" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[100px] flex-1"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[100px] flex-1"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[100px] flex-1"
              >
                Agendamentos
              </TabsTrigger>
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
    </>
  );
};
