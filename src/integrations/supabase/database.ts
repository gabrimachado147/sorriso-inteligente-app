import { supabase } from './client'
import type {
  User, UserInsert, UserUpdate,
  Clinic, ClinicInsert, ClinicUpdate,
  Service, ServiceInsert, ServiceUpdate,
  Dentist, DentistInsert, DentistUpdate,
  Appointment, AppointmentInsert, AppointmentUpdate,
  Review, ReviewInsert, ReviewUpdate,
  ServiceCategory
} from './types'

export interface DatabaseError {
  message: string
  code?: string
  details?: string
}

export interface DatabaseResponse<T> {
  data: T | null
  error: DatabaseError | null
}

export interface DatabaseListResponse<T> {
  data: T[] | null
  error: DatabaseError | null
  count?: number
}

// User operations
export const userOperations = {
  async getAll(): Promise<DatabaseListResponse<User>> {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async getById(id: string): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async create(item: UserInsert): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(item)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async update(id: string, updates: UserUpdate): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async delete(id: string): Promise<{ error: DatabaseError | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        return { error: { message: error.message, code: error.code, details: error.details } }
      }

      return { error: null }
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// Appointment operations
export const appointmentOperations = {
  async getAll(): Promise<DatabaseListResponse<Appointment>> {
    try {
      const { data, error, count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async getById(id: string): Promise<DatabaseResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async create(item: AppointmentInsert): Promise<DatabaseResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(item)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async update(id: string, updates: AppointmentUpdate): Promise<DatabaseResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// Service operations
export const serviceOperations = {
  async getAll(): Promise<DatabaseListResponse<Service>> {
    try {
      const { data, error, count } = await supabase
        .from('services')
        .select('*', { count: 'exact' })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// Specialized queries for the dental app
export async function getClinicsWithDetails() {
  try {
    const { data, error } = await supabase
      .from('clinics')
      .select(`
        *,
        services (*),
        dentists (*, users (*))
      `)

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Get user appointments with related data
export async function getUserAppointments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (*),
        dentists (*, users (*)),
        clinics (*)
      `)
      .eq('patient_id', userId)
      .order('appointment_date', { ascending: true })

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Get dentist appointments with related data
export async function getDentistAppointments(dentistId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (*),
        users (*),
        clinics (*)
      `)
      .eq('dentist_id', dentistId)
      .order('appointment_date', { ascending: true })

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Get available appointment slots
export async function getAvailableSlots(dentistId: string, date: string) {
  try {
    const slots: { time: string; available: boolean }[] = []
    const workingHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    
    // Get existing appointments for the date - simplified version
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .eq('dentist_id', dentistId)
      .gte('appointment_date', `${date}T00:00:00`)
      .lt('appointment_date', `${date}T23:59:59`)
      .neq('status', 'cancelled')

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    const bookedTimes = appointments?.map(apt => {
      const time = apt.appointment_date.split('T')[1]
      return time ? time.substring(0, 5) : ''
    }).filter(Boolean) || []

    for (const time of workingHours) {
      slots.push({
        time,
        available: !bookedTimes.includes(time)
      })
    }

    return { data: slots, error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Get reviews for a dentist or clinic
export async function getReviews(targetType: 'dentist' | 'clinic', targetId: string) {
  try {
    const column = targetType === 'dentist' ? 'dentist_id' : 'clinic_id'
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (*)
      `)
      .eq(column, targetId)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Search services by name or category
export async function searchServices(query: string, category?: ServiceCategory) {
  try {
    let dbQuery = supabase
      .from('services')
      .select(`
        *,
        clinics (*)
      `)
      .eq('is_active', true)

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data, error } = await dbQuery.order('name')

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
