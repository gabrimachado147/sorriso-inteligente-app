import { supabase } from '@/integrations/supabase/client';

export interface AppointmentRecord {
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

export interface CreateAppointmentData {
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

const normalizeAppointment = (data: any): AppointmentRecord => ({
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

export class AppointmentService {
  /**
   * Get all appointments
   */
  static async getAllAppointments(): Promise<AppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(normalizeAppointment);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointments by phone number
   */
  static async getAppointmentsByPhone(phone: string): Promise<AppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(normalizeAppointment);
    } catch (error) {
      console.error('Error fetching appointments by phone:', error);
      throw error;
    }
<<<<<<< HEAD
=======
  ): Promise<Appointment[]> {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        clinic:clinics(id, name, address, phone, whatsapp),
        dentist:dentists(id, full_name, specialties, photo_url),
        service:services(id, name, duration, price)
      `)
      .eq('patient_id', userId)

    if (options?.status) {
      query = query.in('status', options.status as Array<'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'>)
    }

    if (options?.upcoming) {
      const today = new Date().toISOString().split('T')[0]
      query = query.gte('appointment_date', today)
    }

    query = query.order('appointment_date', { ascending: true })
                 .order('appointment_time', { ascending: true })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user appointments:', error)
      throw new Error(error.message)
    }

    return data || []
>>>>>>> main
  }

  /**
   * Get user appointments (for logged in users)
   */
  static async getUserAppointments(userId: string): Promise<AppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('user_appointments')
        .select(`
          appointment_id,
          created_at,
          appointments (*)
        `)
        .eq('user_id', userId);

<<<<<<< HEAD
      if (error) throw error;
=======
    if (error) {
      console.error('Error fetching clinic appointments:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Update appointment
   */
  static async update(
    appointmentId: string, 
    updates: AppointmentUpdate
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        clinic:clinics(*),
        dentist:dentists(*),
        service:services(*)
      `)
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Cancel appointment
   */
  static async cancel(
    appointmentId: string, 
    reason?: string
  ): Promise<Appointment> {
    return this.update(appointmentId, {
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
    })
  }

  /**
   * Confirm appointment
   */
  static async confirm(appointmentId: string): Promise<Appointment> {
    return this.update(appointmentId, {
      status: 'confirmed'
    })
  }

  /**
   * Get available time slots for a clinic/dentist
   */
  static async getAvailableSlots(
    clinicId: string,
    date: string,
    dentistId?: string,
    duration: number = 60
  ): Promise<string[]> {
    // First get existing appointments for the date
    let query = supabase
      .from('appointments')
      .select('appointment_date, duration_minutes')
      .eq('clinic_id', clinicId)
      .like('appointment_date', `${date}%`)
      .in('status', ['scheduled', 'confirmed', 'in_progress'])

    if (dentistId) {
      query = query.eq('dentist_id', dentistId)
    }

    const { data: existingAppointments, error } = await query

    if (error) {
      console.error('Error fetching existing appointments:', error)
      throw new Error(error.message)
    }

    // Get clinic working hours for the day
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('opening_hours')
      .eq('id', clinicId)
      .single()

    if (clinicError) {
      console.error('Error fetching clinic:', clinicError)
      throw new Error(clinicError.message)
    }

    // Generate available slots based on working hours and existing appointments
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const workingHours = clinic.opening_hours as Record<string, { open: string; close: string }> | null
    
    if (!workingHours || !workingHours[dayOfWeek]) {
      return [] // Clinic closed on this day
    }

    const openTime = workingHours[dayOfWeek].open
    const closeTime = workingHours[dayOfWeek].close
    
    // Generate time slots
    const slots: string[] = []
    const start = new Date(`${date}T${openTime}`)
    const end = new Date(`${date}T${closeTime}`)
    
    for (let time = start; time < end; time.setMinutes(time.getMinutes() + duration)) {
      const timeStr = time.toTimeString().slice(0, 5)
>>>>>>> main
      
      return (data?.map(item => item.appointments).filter(Boolean) || []).map(normalizeAppointment);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }

  /**
   * Create appointment
   */
  static async createAppointment(data: CreateAppointmentData): Promise<AppointmentRecord> {
    try {
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

      if (error) throw error;
      return normalizeAppointment(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
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
   * Update appointment status
   */
  static async updateAppointmentStatus(
    appointmentId: string,
    status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  ): Promise<AppointmentRecord> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return normalizeAppointment(data);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  /**
   * Get appointment statistics
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
   * Get appointments by clinic (for admin dashboard)
   */
  static async getAppointmentsByClinic(clinicName: string): Promise<AppointmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .ilike('clinic', `%${clinicName}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(normalizeAppointment);
    } catch (error) {
      console.error('Error fetching appointments by clinic:', error);
      throw error;
    }
  }
}
