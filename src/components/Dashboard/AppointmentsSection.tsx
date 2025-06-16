
import React from 'react';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface AppointmentsSectionProps {
  appointments: AppointmentRecord[];
  selectedClinic: string;
  realtimeConnected?: boolean;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ 
  appointments, 
  selectedClinic,
  realtimeConnected = false
}) => {
  const { 
    updateAppointmentStatus, 
    updateAppointmentService,
    updateAppointment
  } = useAppointments();

  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    try {
      console.log('[AppointmentsSection] Updating status:', { appointmentId, newStatus });
      await updateAppointmentStatus.mutateAsync({ appointmentId, status: newStatus });
    } catch (error) {
      console.error('[AppointmentsSection] Error updating status:', error);
    }
  };

  const handleServiceUpdate = async (appointmentId: string, service: string, price?: number) => {
    try {
      console.log('[AppointmentsSection] Updating service:', { appointmentId, service, price });
      await updateAppointmentService.mutateAsync({ appointmentId, service, price });
    } catch (error) {
      console.error('[AppointmentsSection] Error updating service:', error);
    }
  };

  const handleAppointmentUpdate = async (appointmentId: string, updates: any) => {
    try {
      console.log('[AppointmentsSection] Updating appointment:', { appointmentId, updates });
      await updateAppointment.mutateAsync({ appointmentId, updates });
    } catch (error) {
      console.error('[AppointmentsSection] Error updating appointment:', error);
    }
  };

  const isUpdating = updateAppointmentStatus.isPending || 
                    updateAppointmentService.isPending || 
                    updateAppointment.isPending;

  return (
    <div className="space-y-4">
      {realtimeConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">
            🟢 Conexão em tempo real ativa - Esta tabela será atualizada automaticamente quando novos agendamentos chegarem via chat
          </p>
        </div>
      )}

      <AppointmentsTable
        appointments={appointments}
        onStatusChange={handleStatusChange}
        onServiceUpdate={handleServiceUpdate}
        onAppointmentUpdate={handleAppointmentUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};
