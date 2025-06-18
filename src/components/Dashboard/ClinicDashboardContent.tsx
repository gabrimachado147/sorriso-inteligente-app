
import React from 'react';
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
    
    // Create CSV content based on config
    const headers = ['Nome', 'Telefone', 'Data', 'Horário', 'Serviço', 'Status', 'Clínica'];
    const csvContent = [
      headers.join(','),
      ...filteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.service,
        apt.status,
        apt.clinic
      ].join(','))
    ].join('\n');

    // Download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${config.name}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="w-full overflow-hidden">
            <DashboardCharts
              monthlyData={dashboardData.monthlyData}
              servicesData={dashboardData.servicesData}
              statusData={dashboardData.statusData}
              confirmedAppointments={dashboardData.confirmedAppointments}
              completedAppointments={dashboardData.completedAppointments}
              pendingAppointments={dashboardData.pendingAppointments}
              cancelledAppointments={dashboardData.cancelledAppointments}
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="w-full overflow-hidden">
            <AdvancedAnalytics 
              appointments={filteredAppointments} 
              clinicName={clinicName}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="w-full overflow-hidden">
            <ReportGenerator
              templates={defaultReportTemplates}
              onGenerateReport={handleGenerateReport}
              isGenerating={false}
            />
          </div>
        );
      case 'appointments':
        return (
          <div className="w-full overflow-hidden">
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
        return (
          <div className="w-full overflow-hidden">
            <MessageTemplates 
              onSendMessage={onSendBulkMessage} 
              appointments={filteredAppointments} 
            />
          </div>
        );
      default:
        return (
          <div className="w-full overflow-hidden">
            <DashboardCharts
              monthlyData={dashboardData.monthlyData}
              servicesData={dashboardData.servicesData}
              statusData={dashboardData.statusData}
              confirmedAppointments={dashboardData.confirmedAppointments}
              completedAppointments={dashboardData.completedAppointments}
              pendingAppointments={dashboardData.pendingAppointments}
              cancelledAppointments={dashboardData.cancelledAppointments}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-6 mt-0">
        {renderContent()}
      </div>
    </div>
  );
};
