
// Supabase service for managing clinics using existing tables
import { supabase } from '../../integrations/supabase/client'

// Mock interfaces for clinic data since these tables don't exist in the database
export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  specialties: string[]
  city: string
  rating: number
  verified: boolean
  featured: boolean
  emergency_available: boolean
}

export interface Service {
  id: string
  clinic_id: string
  name: string
  category: string
  price: number
  active: boolean
}

export interface Dentist {
  id: string
  clinic_id: string
  full_name: string
  specialties: string[]
  rating: number
  active: boolean
}

interface ClinicReview {
  id: string;
  patient_id: string;
  dentist_id: string | null;
  clinic_id: string;
  appointment_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  patient: {
    full_name: string | null;
  } | null;
  dentist: {
    full_name: string | null;
  } | null;
}

export class ClinicService {
  /**
   * Get all clinics with filters
   * Note: This is a mock implementation since clinic tables don't exist
   */
  static async getAll(options?: {
    specialty?: string
    city?: string
    emergencyOnly?: boolean
    featured?: boolean
    limit?: number
    search?: string
  }): Promise<Clinic[]> {
    console.log('Mock clinic data requested with options:', options)
    
    // Return mock data since clinic tables don't exist
    return [
      {
        id: '1',
        name: 'Clínica Senhor Sorriso',
        address: 'Rua das Flores, 123',
        phone: '(11) 1234-5678',
        specialties: ['Ortodontia', 'Implantes'],
        city: 'São Paulo',
        rating: 4.8,
        verified: true,
        featured: true,
        emergency_available: true
      }
    ]
  }

  /**
   * Get clinic by ID with full details
   */
  static async getById(clinicId: string): Promise<Clinic | null> {
    console.log('Mock clinic by ID requested:', clinicId)
    
    // Return mock data
    return {
      id: clinicId,
      name: 'Clínica Senhor Sorriso',
      address: 'Rua das Flores, 123',
      phone: '(11) 1234-5678',
      specialties: ['Ortodontia', 'Implantes'],
      city: 'São Paulo',
      rating: 4.8,
      verified: true,
      featured: true,
      emergency_available: true
    }
  }

  /**
   * Get clinics by specialty
   */
  static async getBySpecialty(specialty: string): Promise<Clinic[]> {
    return this.getAll({ specialty })
  }

  /**
   * Get emergency clinics
   */
  static async getEmergencyAvailable(): Promise<Clinic[]> {
    return this.getAll({ emergencyOnly: true })
  }

  /**
   * Get featured clinics
   */
  static async getFeatured(limit: number = 6): Promise<Clinic[]> {
    return this.getAll({ featured: true, limit })
  }

  /**
   * Search clinics
   */
  static async search(
    searchTerm: string, 
    filters?: {
      specialty?: string
      city?: string
      emergency?: boolean
    }
  ): Promise<Clinic[]> {
    return this.getAll({
      search: searchTerm,
      ...filters
    })
  }

  /**
   * Get clinics near location
   */
  static async getNearby(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<Clinic[]> {
    console.log(`Mock search for clinics near ${latitude}, ${longitude} within ${radiusKm}km`)
    return this.getAll()
  }

  /**
   * Get clinic services
   */
  static async getServices(clinicId: string): Promise<Service[]> {
    console.log('Mock services for clinic:', clinicId)
    
    return [
      {
        id: '1',
        clinic_id: clinicId,
        name: 'Consulta',
        category: 'Geral',
        price: 100,
        active: true
      },
      {
        id: '2',
        clinic_id: clinicId,
        name: 'Limpeza',
        category: 'Preventivo',
        price: 80,
        active: true
      }
    ]
  }

  /**
   * Get clinic dentists
   */
  static async getDentists(clinicId: string): Promise<Dentist[]> {
    console.log('Mock dentists for clinic:', clinicId)
    
    return [
      {
        id: '1',
        clinic_id: clinicId,
        full_name: 'Dr. João Silva',
        specialties: ['Ortodontia'],
        rating: 4.9,
        active: true
      }
    ]
  }

  /**
   * Get clinic working hours for a specific day
   */
  static async getWorkingHours(
    clinicId: string, 
    dayOfWeek: string
  ): Promise<{ open: string; close: string } | null> {
    console.log('Mock working hours for clinic:', clinicId, 'day:', dayOfWeek)
    
    // Return mock working hours since working_hours column doesn't exist
    return { open: '08:00', close: '18:00' };
  }

  /**
   * Check if clinic is open now
   */
  static async isOpenNow(clinicId: string): Promise<boolean> {
    const now = new Date()
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const currentTime = now.toTimeString().slice(0, 5)

    const hours = await this.getWorkingHours(clinicId, dayOfWeek)
    
    if (!hours) {
      return false // Closed today
    }

    return currentTime >= hours.open && currentTime <= hours.close
  }

  /**
   * Get clinic reviews
   */
  static async getReviews(
    clinicId: string, 
    options?: {
      limit?: number
      rating?: number
    }
  ): Promise<Record<string, unknown>[]> {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        patient:user_profiles(full_name),
        dentist:user_profiles(full_name)
      `)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })

    if (options?.rating) {
      query = query.eq('rating', options.rating)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching clinic reviews:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Get clinic statistics using existing tables
   */
  static async getStats(clinicId: string): Promise<{
    totalAppointments: number
    totalReviews: number
    averageRating: number
    specialtyCount: number
    dentistCount: number
  }> {
    console.log('Mock stats for clinic:', clinicId)
    
    // Use leads as appointment proxy
    const { data: leads } = await supabase
      .from('leads_whatsapp_senhor_sorriso')
      .select('id', { count: 'exact' })

    return {
      totalAppointments: leads?.length || 0,
      totalReviews: 5,
      averageRating: 4.8,
      specialtyCount: 3,
      dentistCount: 2
    }
  }

  /**
   * Get all available specialties
   */
  static async getSpecialties(): Promise<string[]> {
    console.log('Mock specialties requested')
    
    return ['Ortodontia', 'Implantes', 'Clínica Geral', 'Endodontia', 'Periodontia']
  }

  /**
   * Get all cities with clinics
   */
  static async getCities(): Promise<string[]> {
    console.log('Mock cities requested')
    
    return ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília']
  }

  /**
   * Get clinic insurance providers
   */
  static async getInsuranceProviders(): Promise<string[]> {
    console.log('Mock insurance providers requested')
    
    return ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil']
  }
}

// Export default instance for convenience
export const clinicService = ClinicService
