
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface RealAppointmentRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  clinic: string;
  service: string;
  status: string;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  clinic_filter?: string;
}

export interface CreateRealAppointmentData {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  clinic: string;
  service: string;
  status?: string;
  notes?: string;
  source?: string;
  webhook_session_id?: string;
}

type AppointmentRow = Tables<'appointments'>;

const normalizeRealAppointment = (data: AppointmentRow): RealAppointmentRecord => ({
  id: data.id,
  name: data.name,
  phone: data.phone,
  email: data.email || undefined,
  date: data.date,
  time: data.time,
  clinic: data.clinic,
  service: data.service,
  status: data.status,
  notes: data.notes || undefined,
  source: data.source || undefined,
  created_at: data.created_at,
  updated_at: data.updated_at,
  clinic_filter: data.clinic_filter || undefined
});

export class RealAppointmentService {
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
    status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
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
   * Get appointment statistics (requires authentication)
   */
  static async getAppointmentStats() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('status, created_at, clinic');

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      const stats = {
        total: data?.length || 0,
        today: data?.filter(apt => apt.created_at.startsWith(today)).length || 0,
        thisMonth: data?.filter(apt => apt.created_at.startsWith(thisMonth)).length || 0,
        confirmed: data?.filter(apt => apt.status === 'confirmed').length || 0,
        completed: data?.filter(apt => apt.status === 'completed').length || 0,
        cancelled: data?.filter(apt => apt.status === 'cancelled').length || 0,
        byClinic: data?.reduce((acc, apt) => {
          acc[apt.clinic] = (acc[apt.clinic] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      return stats;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
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
