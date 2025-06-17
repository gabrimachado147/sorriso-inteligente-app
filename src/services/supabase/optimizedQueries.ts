
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Types for better type safety
export type PatientData = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  emergency_contact?: string;
  medical_notes?: string;
  created_at: string;
  updated_at: string;
};

export type AppointmentData = {
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
  created_at: string;
  updated_at: string;
};

export class OptimizedSupabaseService {
  // Efficient patient queries with specific field selection
  static async getPatients(fields?: string[]): Promise<PatientData[]> {
    const selectFields = fields?.join(', ') || 'id, full_name, phone, date_of_birth, created_at, updated_at';
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select(selectFields)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return (data || []) as PatientData[];
  }

  // Optimized appointment queries with pagination
  static async getAppointments(options: {
    page?: number;
    pageSize?: number;
    clinic?: string;
    status?: string;
    fields?: string[];
  } = {}): Promise<{ data: AppointmentData[]; count: number }> {
    const {
      page = 1,
      pageSize = 20,
      clinic,
      status,
      fields = ['id', 'name', 'phone', 'date', 'time', 'clinic', 'service', 'status', 'created_at']
    } = options;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('appointments')
      .select(fields.join(', '), { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (clinic) {
      query = query.eq('clinic', clinic);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: (data || []) as AppointmentData[], count: count || 0 };
  }

  // Search patients with optimized indexing
  static async searchPatients(searchTerm: string): Promise<PatientData[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, phone, created_at')
      .or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('full_name', { ascending: true })
      .limit(50);

    if (error) throw error;
    return (data || []) as PatientData[];
  }

  // Get appointments by date range with clinic filter
  static async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    clinic?: string
  ): Promise<AppointmentData[]> {
    let query = supabase
      .from('appointments')
      .select('id, name, phone, date, time, clinic, service, status')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (clinic) {
      query = query.eq('clinic', clinic);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AppointmentData[];
  }

  // Get patient statistics
  static async getPatientStats(): Promise<{
    total: number;
    newThisMonth: number;
    activeAppointments: number;
  }> {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [patientsResult, newPatientsResult, appointmentsResult] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }).gte('created_at', `${currentMonth}-01`),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'confirmed')
    ]);

    return {
      total: patientsResult.count || 0,
      newThisMonth: newPatientsResult.count || 0,
      activeAppointments: appointmentsResult.count || 0
    };
  }
}
