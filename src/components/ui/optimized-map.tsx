
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Clock, Star, Navigation, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveFeedback } from './interactive-feedback';
import { MicroInteraction } from './micro-interactions';

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  hours: string;
  services: string[];
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface OptimizedMapProps {
  clinics: Clinic[];
  className?: string;
  onClinicSelect?: (clinic: Clinic) => void;
}

export const OptimizedMap: React.FC<OptimizedMapProps> = ({
  clinics,
  className,
  onClinicSelect
}) => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filtrar clínicas baseado na busca
  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic =>
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.services.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [clinics, searchTerm]);

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  // Calcular distância aproximada
  const calculateDistance = (clinic: Clinic): number => {
    if (!userLocation) return 0;
    
    const R = 6371; // Raio da Terra em km
    const dLat = (clinic.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (clinic.coordinates.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(clinic.coordinates.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    onClinicSelect?.(clinic);
  };

  const openInMaps = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address + ', ' + clinic.city)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por cidade, nome ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de clínicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClinics.map((clinic) => {
          const distance = userLocation ? calculateDistance(clinic) : null;
          
          return (
            <MicroInteraction key={clinic.id} type="hover-lift" trigger="hover">
              <Card 
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-lg',
                  selectedClinic?.id === clinic.id && 'ring-2 ring-primary border-primary'
                )}
                onClick={() => handleClinicSelect(clinic)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {clinic.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{clinic.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{clinic.address}, {clinic.city} - {clinic.state}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{clinic.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{clinic.hours}</span>
                    </div>
                    
                    {distance && (
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        <span>{distance.toFixed(1)} km de distância</span>
                      </div>
                    )}
                  </div>

                  {/* Serviços */}
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {clinic.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{clinic.services.length - 3} mais
                      </Badge>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <InteractiveFeedback feedbackType="scale" className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openInMaps(clinic);
                        }}
                        className="w-full"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver no Mapa
                      </Button>
                    </InteractiveFeedback>
                    
                    <InteractiveFeedback feedbackType="scale" className="flex-1">
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${clinic.phone}`, '_self');
                        }}
                        className="w-full"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </Button>
                    </InteractiveFeedback>
                  </div>
                </CardContent>
              </Card>
            </MicroInteraction>
          );
        })}
      </div>

      {filteredClinics.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma clínica encontrada para "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Dados de exemplo das clínicas
export const sampleClinics: Clinic[] = [
  {
    id: '1',
    name: 'Senhor Sorriso Campo Belo',
    address: 'Rua Principal, 123',
    city: 'Campo Belo',
    state: 'MG',
    phone: '(35) 3333-1234',
    rating: 4.9,
    hours: 'Seg-Sex: 8h-18h, Sáb: 8h-12h',
    services: ['Ortodontia', 'Implantes', 'Limpeza', 'Clareamento'],
    coordinates: { lat: -20.8897, lng: -45.2729 }
  },
  {
    id: '2',
    name: 'Senhor Sorriso Formiga',
    address: 'Av. Central, 456',
    city: 'Formiga',
    state: 'MG',
    phone: '(37) 3333-5678',
    rating: 4.8,
    hours: 'Seg-Sex: 7h-17h, Sáb: 8h-12h',
    services: ['Emergência 24h', 'Cirurgia', 'Prótese', 'Periodontia'],
    coordinates: { lat: -20.4644, lng: -45.4264 }
  },
  {
    id: '3',
    name: 'Senhor Sorriso Itararé',
    address: 'Rua da Saúde, 789',
    city: 'Itararé',
    state: 'SP',
    phone: '(15) 3333-9012',
    rating: 4.7,
    hours: 'Seg-Sex: 8h-17h, Sáb: 9h-13h',
    services: ['Odontopediatria', 'Estética', 'Endodontia', 'Radiologia'],
    coordinates: { lat: -24.1145, lng: -49.3387 }
  }
];
