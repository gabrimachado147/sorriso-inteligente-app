
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Navigation, Clock } from 'lucide-react'
import { useGeolocation, useNearbyClinicas } from '@/hooks/useGeolocation'
import { GeolocationService } from '@/services/geolocation'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'
import { toastError } from '@/components/ui/custom-toast'

export const NearbyClinicas = () => {
  const { location, getCurrentLocation, loading: locationLoading, error } = useGeolocation()
  const { data: nearbyClinicas, isLoading: clinicsLoading } = useNearbyClinicas(location)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const handleGetDirections = (clinic: any) => {
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      GeolocationService.openAppleMapsRoute({
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        name: clinic.name
      })
    } else {
      GeolocationService.openGoogleMapsRoute({
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        name: clinic.name
      })
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Não foi possível acessar sua localização
          </p>
          <Button onClick={getCurrentLocation} disabled={locationLoading}>
            {locationLoading ? 'Tentando...' : 'Tentar Novamente'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (locationLoading || clinicsLoading) {
    return <EnhancedSkeleton variant="card" count={3} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clínicas Próximas</h2>
        <Button variant="outline" onClick={getCurrentLocation}>
          <Navigation className="w-4 h-4 mr-2" />
          Atualizar Localização
        </Button>
      </div>

      {nearbyClinicas?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Nenhuma clínica encontrada nas proximidades
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {nearbyClinicas?.map((clinic) => (
            <Card key={clinic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{clinic.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {clinic.address}, {clinic.city} - {clinic.state}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {clinic.distance} km
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {clinic.phone}
                  </div>
                  {clinic.estimated_travel_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {clinic.estimated_travel_time}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleGetDirections(clinic)} className="flex-1">
                    <Navigation className="w-4 h-4 mr-2" />
                    Como Chegar
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`tel:${clinic.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
