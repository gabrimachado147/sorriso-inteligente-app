
import React from 'react';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface AppointmentsSectionProps {
  appointments: AppointmentRecord[];
  selectedClinic: string;
  realtimeConnected?: boolean;
  // Optional props for HomePage usage
  onReschedule?: () => void;
  onViewAllAppointments?: () => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ 
  appointments, 
  selectedClinic,
  realtimeConnected = false,
  onReschedule,
  onViewAllAppointments
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

      {/* HomePage specific buttons */}
      {(onReschedule || onViewAllAppointments) && (
        <div className="flex gap-2 mb-4">
          {onReschedule && (
            <button 
              onClick={onReschedule}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reagendar
            </button>
          )}
          {onViewAllAppointments && (
            <button 
              onClick={onViewAllAppointments}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Ver Todos
            </button>
          )}
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
