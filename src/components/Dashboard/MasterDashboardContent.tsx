
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

      {/* Tabs com espaçamento ajustado */}
      <div className={`${animations.fadeIn} w-full`}>
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center w-full mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md h-11 bg-gray-100 rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 text-sm font-medium px-4 py-2 rounded-md"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 text-sm font-medium px-4 py-2 rounded-md"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 text-sm font-medium px-4 py-2 rounded-md"
              >
                Agendamentos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <MasterDashboardCharts
              clinicStats={dashboardData.clinicStats}
              monthlyTrend={dashboardData.monthlyTrend}
              serviceDistribution={dashboardData.serviceDistribution}
              statusBreakdown={dashboardData.statusBreakdown}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <MasterDashboardCharts
              clinicStats={dashboardData.clinicStats}
              monthlyTrend={dashboardData.monthlyTrend}
              serviceDistribution={dashboardData.serviceDistribution}
              statusBreakdown={dashboardData.statusBreakdown}
            />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6 mt-6">
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
