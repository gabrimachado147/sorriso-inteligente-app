import { supabase } from '@/integrations/supabase/client';

interface RescheduleData {
  appointmentId: string;
  newDate: string;
  newTime: string;
  reason: string;
}

interface CancelData {
  appointmentId: string;
  reason: string;
}

export class AppointmentActionsService {
  /**
   * Check if a time slot is available for a given date, time, and clinic
   */
  static async isTimeSlotAvailable(date: string, time: string, clinic: string, appointmentId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .eq('time', time)
        .eq('clinic', clinic);

      if (error) {
        console.error('Error checking time slot availability:', error);
        return false;
      }

      // If appointmentId is provided, exclude the current appointment from the check
      const conflictingAppointments = appointmentId
        ? data.filter(apt => apt.id !== appointmentId)
        : data;

      return conflictingAppointments.length === 0;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Reschedule an appointment
   */
  static async rescheduleAppointment(data: RescheduleData): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          date: data.newDate,
          time: data.newTime,
          notes: `${data.reason} (Reagendado)`
        })
        .eq('id', data.appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(data: CancelData): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          notes: `${data.reason} (Cancelado)`
        })
        .eq('id', data.appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Delete appointment permanently
   */
  static async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      // First delete related user_appointments entries
      const { error: userAppointmentError } = await supabase
        .from('user_appointments')
        .delete()
        .eq('appointment_id', appointmentId);

      if (userAppointmentError) {
        console.error('Error deleting user appointment links:', userAppointmentError);
      }

      // Delete related reminders
      const { error: remindersError } = await supabase
        .from('reminders')
        .delete()
        .eq('appointment_id', appointmentId);

      if (remindersError) {
        console.error('Error deleting reminders:', remindersError);
      }

      // Finally delete the appointment itself
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
}
