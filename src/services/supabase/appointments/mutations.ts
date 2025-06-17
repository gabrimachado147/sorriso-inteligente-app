
import { supabase } from '@/integrations/supabase/client';
import type { CreateRealAppointmentData, RealAppointmentRecord, AppointmentStatus } from './types';
import { normalizeRealAppointment } from './utils';

export class AppointmentMutations {
  /**
   * Create appointment (public access)
   */
  static async createAppointment(data: CreateRealAppointmentData): Promise<RealAppointmentRecord> {
    try {
      console.log('Creating appointment in Supabase:', data);
      
      const appointmentData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date: data.date,
        time: data.time,
        clinic: data.clinic,
        service: data.service,
        status: data.status || 'confirmed',
        notes: data.notes,
        source: data.source || 'pwa',
        clinic_filter: data.clinic,
        webhook_session_id: data.webhook_session_id
      };

      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        console.error('Supabase create error:', error);
        throw error;
      }

      console.log('Appointment created successfully:', appointment);
      return normalizeRealAppointment(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment status (requires authentication)
   */
  static async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<RealAppointmentRecord> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return normalizeRealAppointment(data);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  /**
   * Link user to appointment
   */
  static async linkUserAppointment(userId: string, appointmentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_appointments')
        .insert({
          user_id: userId,
          appointment_id: appointmentId
        });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }
    } catch (error) {
      console.error('Error linking user appointment:', error);
      throw error;
    }
  }
}
