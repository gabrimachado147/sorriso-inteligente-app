
// Serviço para geolocalização
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
  latitude: number
  longitude: number
  distance: number
  estimated_travel_time?: string
}

export class GeolocationService {
  // Obter localização atual do usuário
  static async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
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
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Buscar clínicas próximas
  static async getNearbyClinicles(userLocation: UserLocation, maxDistance: number = 50): Promise<ClinicWithDistance[]> {
    try {
      const { data: clinics, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      const clinicsWithDistance = clinics?.map(clinic => {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          clinic.latitude,
          clinic.longitude
        )

        return {
          ...clinic,
          distance: Math.round(distance * 10) / 10
        }
      }).filter(clinic => clinic.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance) || []

      return clinicsWithDistance
    } catch (error) {
      console.error('Error fetching nearby clinics:', error)
      return []
    }
  }

  // Calcular distância entre duas coordenadas (fórmula de Haversine)
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  // Obter tempo estimado de viagem usando Google Maps API
  static async getTravelTime(origin: UserLocation, destination: { latitude: number, longitude: number }): Promise<string> {
    try {
      // Esta seria uma integração real com Google Maps API
      // Por enquanto, retornamos uma estimativa básica
      const distance = this.calculateDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude
      )

      // Estimativa básica: 40km/h de velocidade média
      const timeInHours = distance / 40
      const timeInMinutes = Math.round(timeInHours * 60)

      if (timeInMinutes < 60) {
        return `${timeInMinutes} min`
      } else {
        const hours = Math.floor(timeInMinutes / 60)
        const minutes = timeInMinutes % 60
        return `${hours}h ${minutes}min`
      }
    } catch (error) {
      console.error('Error calculating travel time:', error)
      return 'N/A'
    }
  }

  // Abrir rotas no Google Maps
  static openGoogleMapsRoute(destination: { latitude: number, longitude: number, name: string }) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&destination_place_id=${encodeURIComponent(destination.name)}`
    window.open(url, '_blank')
  }

  // Abrir rotas no Apple Maps (para dispositivos iOS)
  static openAppleMapsRoute(destination: { latitude: number, longitude: number, name: string }) {
    const url = `http://maps.apple.com/?daddr=${destination.latitude},${destination.longitude}&dirflg=d`
    window.open(url, '_blank')
  }
}
