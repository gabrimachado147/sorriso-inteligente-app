
import { supabase } from '@/integrations/supabase/client';
import type { RealAppointmentRecord } from './types';
import { normalizeRealAppointment } from './utils';

export class AppointmentQueries {
  /**
   * Get all appointments (requires authentication)
   */
  static async getAllAppointments(): Promise<RealAppointmentRecord[]> {
    try {
      console.log('Fetching all appointments from Supabase...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched appointments:', data?.length || 0);
      return (data || []).map(normalizeRealAppointment);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointments by phone number
   */
  static async getAppointmentsByPhone(phone: string): Promise<RealAppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(normalizeRealAppointment);
    } catch (error) {
      console.error('Error fetching appointments by phone:', error);
      throw error;
    }
  }

  /**
   * Get user appointments (for logged in users)
   */
  static async getUserAppointments(userId: string): Promise<RealAppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('user_appointments')
        .select(`
          appointment_id,
          created_at,
          appointments (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return (data?.map(item => item.appointments).filter(Boolean) || []).map(normalizeRealAppointment);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }
}
