
import { supabase } from '@/integrations/supabase/client';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export interface RescheduleAppointmentData {
  appointmentId: string;
  newDate: string;
  newTime: string;
  reason?: string;
}

export interface CancelAppointmentData {
  appointmentId: string;
  reason?: string;
}

export class AppointmentActionsService {
  /**
   * Cancelar agendamento
   */
  static async cancelAppointment(data: CancelAppointmentData): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          notes: data.reason ? `Cancelado: ${data.reason}` : 'Cancelado pelo usuário'
        })
        .eq('id', data.appointmentId);

      if (error) throw error;

      toastSuccess('Consulta Cancelada', 'Sua consulta foi cancelada com sucesso');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toastError('Erro', 'Não foi possível cancelar a consulta');
      throw error;
    }
  }

  /**
   * Reagendar consulta
   */
  static async rescheduleAppointment(data: RescheduleAppointmentData): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          date: data.newDate,
          time: data.newTime,
          notes: data.reason ? `Reagendado: ${data.reason}` : 'Reagendado pelo usuário'
        })
        .eq('id', data.appointmentId);

      if (error) throw error;

      toastSuccess('Consulta Reagendada', `Nova data: ${data.newDate} às ${data.newTime}`);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toastError('Erro', 'Não foi possível reagendar a consulta');
      throw error;
    }
  }

  /**
   * Verificar se um horário está disponível
   */
  static async isTimeSlotAvailable(date: string, time: string, clinic: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('appointments')
        .select('id')
        .eq('date', date)
        .eq('time', time)
        .eq('clinic', clinic)
        .neq('status', 'cancelled');

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return !data || data.length === 0;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }
}
