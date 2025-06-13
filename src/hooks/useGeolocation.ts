
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GeolocationService, type UserLocation, type ClinicWithDistance } from '@/services/geolocation'

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const userLocation = await GeolocationService.getCurrentLocation()
      setLocation(userLocation)
      return userLocation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter localização'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    location,
    error,
    loading,
    getCurrentLocation
  }
}

export const useNearbyClinicas = (location: UserLocation | null, maxDistance: number = 50) => {
  return useQuery({
    queryKey: ['nearby-clinics', location?.latitude, location?.longitude, maxDistance],
    queryFn: () => GeolocationService.getNearbyClinicles(location!, maxDistance),
    enabled: !!location,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}
