
import { supabase } from '@/integrations/supabase/client'

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface ClinicWithDistance {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  email?: string
  latitude?: number
  longitude?: number
  distance: number
  working_hours?: any
}

export class GeolocationService {
  static async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada neste navegador'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          let message = 'Erro ao obter localização'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Permissão de localização negada'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Localização indisponível'
              break
            case error.TIMEOUT:
              message = 'Tempo limite excedido'
              break
          }
          reject(new Error(message))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    })
  }

  static async getNearbyClinicles(
    userLocation: UserLocation, 
    maxDistance: number = 50
  ): Promise<ClinicWithDistance[]> {
    try {
      const { data: clinics, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      const clinicsWithDistance = clinics
        ?.filter(clinic => clinic.latitude && clinic.longitude)
        .map(clinic => {
          const distance = this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            clinic.latitude as number,
            clinic.longitude as number
          )

          return {
            ...clinic,
            distance,
            email: clinic.email || undefined
          } as ClinicWithDistance
        })
        .filter(clinic => clinic.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance) || []

      return clinicsWithDistance
    } catch (error) {
      console.error('Error fetching nearby clinics:', error)
      return []
    }
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.degreesToRadians(lat2 - lat1)
    const dLon = this.degreesToRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  static async getRouteToClinic(
    userLocation: UserLocation,
    clinicLocation: { latitude: number; longitude: number }
  ) {
    // Integração com Google Maps Directions API (implementar quando necessário)
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${clinicLocation.latitude},${clinicLocation.longitude}`
    return { url: googleMapsUrl }
  }
}
