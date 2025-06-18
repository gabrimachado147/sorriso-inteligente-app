
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { EnhancedAppointmentsTable } from '@/components/Appointments/EnhancedAppointmentsTable';
import { DashboardCharts } from './DashboardCharts';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { MessageTemplates } from './MessageTemplates';

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
      case 'advanced':
        return (
          <AdvancedAnalytics 
            appointments={filteredAppointments} 
            clinicName={clinicName}
          />
        );
      default:
        return null;
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
            <TabsContent value="appointments" className="space-y-6 mt-0">
              {renderContent('appointments')}
            </TabsContent>
            <TabsContent value="messages" className="space-y-6 mt-0">
              {renderContent('messages')}
            </TabsContent>
            <TabsContent value="advanced" className="space-y-6 mt-0">
              {renderContent('advanced')}
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
