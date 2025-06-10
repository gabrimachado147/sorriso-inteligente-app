// Supabase service for managing appointments
import { supabase } from '../../integrations/supabase/client'
import type {
  Appointment,
  AppointmentInsert,
  AppointmentUpdate,
  AppointmentStatus,
  Database
} from '../../integrations/supabase/types'

interface WorkingHours {
  [day: string]: { open: string; close: string }
}

export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async create(appointment: AppointmentInsert): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select(`
        *,
        clinic:clinics(*),
        dentist:dentists(*),
        service:services(*)
      `)
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Get user appointments
   */
  static async getUserAppointments(
    userId: string,
    options?: {
      status?: AppointmentStatus[]
      limit?: number
      upcoming?: boolean
    }
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
      query = query.in('status', options.status)
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
  }

  /**
   * Get clinic appointments for a specific date
   */
  static async getClinicAppointments(
    clinicId: string, 
    date: string
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users(id, full_name, phone),
        dentist:dentists(id, full_name),
        service:services(id, name, duration)
      `)
      .eq('clinic_id', clinicId)
      .eq('appointment_date', date)
      .in('status', ['scheduled', 'confirmed', 'in_progress'])
      .order('appointment_time', { ascending: true })

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
    const workingHours = clinic.opening_hours as WorkingHours
    
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
      
      // Check if this slot conflicts with existing appointments
      const hasConflict = existingAppointments?.some(apt => {
        const aptStart = new Date(apt.appointment_date)
        const aptDuration = apt.duration_minutes || 60
        const aptEnd = new Date(aptStart.getTime() + (aptDuration * 60000))
        const slotStart = new Date(`${date}T${timeStr}`)
        const slotEnd = new Date(slotStart.getTime() + (duration * 60000))
        
        return (slotStart < aptEnd && slotEnd > aptStart)
      })
      
      if (!hasConflict) {
        slots.push(timeStr)
      }
    }
    
    return slots
  }

  /**
   * Send reminder notifications for upcoming appointments
   */
  static async sendReminders(): Promise<void> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users(full_name, email),
        clinic:clinics(name, address, phone),
        service:services(name)
      `)
      .eq('appointment_date', tomorrowStr)
      .eq('status', 'confirmed')
      .is('reminder_sent_at', null)

    if (error) {
      console.error('Error fetching appointments for reminders:', error)
      return
    }

    if (!appointments?.length) {
      console.log('No appointments need reminders')
      return
    }

    // Send reminders (this would integrate with your notification service)
    for (const appointment of appointments) {
      try {
        // Here you would call your notification service
        console.log(`Sending reminder for appointment ${appointment.id}`)
        
        // Note: reminder tracking would need to be added to the database schema
        // await supabase.from('appointments').update({ reminder_sent_at: new Date().toISOString() }).eq('id', appointment.id)
          
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error)
      }
    }
  }

  /**
   * Get appointment statistics
   */
  static async getStats(userId?: string): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }> {
    let query = supabase
      .from('appointments')
      .select('status')

    if (userId) {
      query = query.eq('patient_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching appointment stats:', error)
      throw new Error(error.message)
    }

    const stats = {
      total: data?.length || 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }

    data?.forEach(appointment => {
      stats[appointment.status as keyof typeof stats]++
    })

    return stats
  }
}

// Export default instance for convenience
export const appointmentService = AppointmentService;
