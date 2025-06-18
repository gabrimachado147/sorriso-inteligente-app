
import React from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { OptimizedDashboardContent } from './OptimizedDashboardContent';

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

export const ClinicDashboardContent: React.FC<ClinicDashboardContentProps> = (props) => {
  return (
    <div className="w-full">
      <OptimizedDashboardContent {...props} />
    </div>
  );
};
