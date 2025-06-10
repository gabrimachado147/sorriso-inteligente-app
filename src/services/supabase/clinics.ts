// Supabase service for managing clinics
import { supabase } from '../../integrations/supabase/client'
import type { 
  Clinic, 
  ClinicInsert, 
  ClinicUpdate,
  Service,
  Dentist
} from '../../integrations/supabase/types'

export class ClinicService {
  /**
   * Get all clinics with filters
   */
  static async getAll(options?: {
    specialty?: string
    city?: string
    emergencyOnly?: boolean
    featured?: boolean
    limit?: number
    search?: string
  }): Promise<Clinic[]> {
    let query = supabase
      .from('clinics')
      .select('*')

    if (options?.specialty) {
      query = query.contains('specialties', [options.specialty])
    }

    if (options?.city) {
      query = query.eq('city', options.city)
    }

    if (options?.emergencyOnly) {
      query = query.eq('emergency_available', true)
    }

    if (options?.featured) {
      query = query.eq('featured', true)
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,specialties.cs.{${options.search}}`)
    }

    query = query.eq('verified', true)
             .order('featured', { ascending: false })
             .order('rating', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching clinics:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Get clinic by ID with full details
   */
  static async getById(clinicId: string): Promise<Clinic | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select(`
        *,
        services(*),
        dentists(*)
      `)
      .eq('id', clinicId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Clinic not found
      }
      console.error('Error fetching clinic:', error)
      throw new Error(error.message)
    }

    return data
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
    // For now, return all clinics as we don't have PostGIS setup
    // In a real implementation, you would use ST_Distance function
    console.log(`Searching for clinics near ${latitude}, ${longitude} within ${radiusKm}km`)
    return this.getAll()
  }

  /**
   * Get clinic services
   */
  static async getServices(clinicId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('active', true)
      .order('category')
      .order('name')

    if (error) {
      console.error('Error fetching clinic services:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Get clinic dentists
   */
  static async getDentists(clinicId: string): Promise<Dentist[]> {
    const { data, error } = await supabase
      .from('dentists')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('active', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching clinic dentists:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Get clinic working hours for a specific day
   */
  static async getWorkingHours(
    clinicId: string, 
    dayOfWeek: string
  ): Promise<{ open: string; close: string } | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('working_hours')
      .eq('id', clinicId)
      .single()

    if (error) {
      console.error('Error fetching clinic working hours:', error)
      throw new Error(error.message)
    }

    const workingHours = data.working_hours as any
    return workingHours?.[dayOfWeek] || null
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
  ): Promise<any[]> {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        patient:users(full_name),
        dentist:dentists(full_name)
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
   * Get clinic statistics
   */
  static async getStats(clinicId: string): Promise<{
    totalAppointments: number
    totalReviews: number
    averageRating: number
    specialtyCount: number
    dentistCount: number
  }> {
    const [appointments, reviews, clinic, dentists] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('clinic_id', clinicId),
      
      supabase
        .from('reviews')
        .select('rating')
        .eq('clinic_id', clinicId),
      
      supabase
        .from('clinics')
        .select('specialties, total_reviews, rating')
        .eq('id', clinicId)
        .single(),
      
      supabase
        .from('dentists')
        .select('id', { count: 'exact' })
        .eq('clinic_id', clinicId)
        .eq('active', true)
    ])

    return {
      totalAppointments: appointments.count || 0,
      totalReviews: clinic.data?.total_reviews || 0,
      averageRating: clinic.data?.rating || 0,
      specialtyCount: clinic.data?.specialties?.length || 0,
      dentistCount: dentists.count || 0
    }
  }

  /**
   * Get all available specialties
   */
  static async getSpecialties(): Promise<string[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('specialties')
      .eq('verified', true)

    if (error) {
      console.error('Error fetching specialties:', error)
      throw new Error(error.message)
    }

    // Flatten and deduplicate specialties
    const allSpecialties = data?.flatMap(clinic => clinic.specialties || []) || []
    return [...new Set(allSpecialties)].sort()
  }

  /**
   * Get all cities with clinics
   */
  static async getCities(): Promise<string[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('city')
      .eq('verified', true)

    if (error) {
      console.error('Error fetching cities:', error)
      throw new Error(error.message)
    }

    const cities = data?.map(clinic => clinic.city).filter(Boolean) || []
    return [...new Set(cities)].sort()
  }

  /**
   * Get clinic insurance providers
   */
  static async getInsuranceProviders(): Promise<string[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('insurance_providers')
      .eq('verified', true)
      .eq('accepts_insurance', true)

    if (error) {
      console.error('Error fetching insurance providers:', error)
      throw new Error(error.message)
    }

    const allProviders = data?.flatMap(clinic => clinic.insurance_providers || []) || []
    return [...new Set(allProviders)].sort()
  }
}

// Export default instance for convenience
export const clinicService = ClinicService;
