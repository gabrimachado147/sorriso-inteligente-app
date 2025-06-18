
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { EnhancedAppointmentsTable } from '@/components/Appointments/EnhancedAppointmentsTable';
import { DashboardCharts } from './DashboardCharts';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { MessageTemplates } from './MessageTemplates';
import { ReportGenerator, defaultReportTemplates } from './ReportGenerator';

interface ClinicDashboardContentProps {
  activeTab: string;
  filteredAppointments: AppointmentRecord[];
  dashboardData: any;
  clinicName: string;
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => Promise<void>;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => Promise<void>;
  onBulkStatusUpdate: (appointmentIds: string[], status: string) => Promise<void>;
  onSendBulkMessage: (appointmentIds: string[], template: string) => Promise<void>;
  isUpdating: boolean;
}

export const ClinicDashboardContent: React.FC<ClinicDashboardContentProps> = ({
  activeTab,
  filteredAppointments,
  dashboardData,
  clinicName,
  onStatusChange,
  onServiceUpdate,
  onBulkStatusUpdate,
  onSendBulkMessage,
  isUpdating
}) => {
  const handleGenerateReport = async (config: any) => {
    console.log('Gerando relatório:', config);
    // Implementar lógica de geração de relatório
  };

  const renderContent = (tabValue: string) => {
    switch (tabValue) {
      case 'overview':
        return (
          <DashboardCharts
            monthlyData={dashboardData.monthlyData}
            servicesData={dashboardData.servicesData}
            statusData={dashboardData.statusData}
            confirmedAppointments={dashboardData.confirmedAppointments}
            completedAppointments={dashboardData.completedAppointments}
            pendingAppointments={dashboardData.pendingAppointments}
            cancelledAppointments={dashboardData.cancelledAppointments}
          />
        );
      case 'analytics':
        return (
          <AdvancedAnalytics 
            appointments={filteredAppointments} 
            clinicName={clinicName}
          />
        );
      case 'reports':
        return (
          <ReportGenerator
            templates={defaultReportTemplates}
            onGenerateReport={handleGenerateReport}
            isGenerating={false}
          />
        );
      case 'appointments':
        return (
          <div className="w-full">
            <EnhancedAppointmentsTable
              appointments={filteredAppointments}
              onStatusChange={onStatusChange}
              onServiceUpdate={onServiceUpdate}
              onBulkStatusUpdate={onBulkStatusUpdate}
              onSendBulkMessage={onSendBulkMessage}
              isUpdating={isUpdating}
            />
          </div>
        );
      case 'messages':
        return <MessageTemplates onSendMessage={onSendBulkMessage} appointments={filteredAppointments} />;
      default:
        return (
          <DashboardCharts
            monthlyData={dashboardData.monthlyData}
            servicesData={dashboardData.servicesData}
            statusData={dashboardData.statusData}
            confirmedAppointments={dashboardData.confirmedAppointments}
            completedAppointments={dashboardData.completedAppointments}
            pendingAppointments={dashboardData.pendingAppointments}
            cancelledAppointments={dashboardData.cancelledAppointments}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Content */}
      <div className="hidden md:block w-full">
        <Tabs value={activeTab} className="w-full">
          <div className="w-full">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {renderContent('overview')}
            </TabsContent>
            <TabsContent value="analytics" className="space-y-6 mt-0">
              {renderContent('analytics')}
            </TabsContent>
            <TabsContent value="reports" className="space-y-6 mt-0">
              {renderContent('reports')}
            </TabsContent>
            <TabsContent value="appointments" className="space-y-6 mt-0">
              {renderContent('appointments')}
            </TabsContent>
            <TabsContent value="messages" className="space-y-6 mt-0">
              {renderContent('messages')}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Mobile Content */}
      <div className="block md:hidden w-full">
        <div className="space-y-6 mt-4">
          {renderContent(activeTab)}
        </div>
      </div>
    </div>
  );
};
