import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filters, FilterState } from "@/components/ui/filters";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { MapPin, Phone, MessageSquare, Navigation, Clock, Star, Users } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  distance: string;
  status: "Aberto" | "Fechado";
  nextAvailable: string;
  services: string[];
  image: string;
}

interface Service {
  id: string;
  name: string;
}

const LocationsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clinic: '',
    service: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: ''
  });

  const availableServices = [
    { id: 'cleaning', name: 'Limpeza' },
    { id: 'extraction', name: 'Extração' },
    { id: 'filling', name: 'Obturação' },
    { id: 'orthodontics', name: 'Ortodontia' },
    { id: 'implants', name: 'Implantes' },
    { id: 'whitening', name: 'Clareamento' }
  ];

  const clinics = [
    {
      id: 1,
      name: "Clínica Dental Centro",
      address: "Rua das Flores, 123 - Centro",
      city: "São Paulo, SP",
      phone: "(11) 3333-4444",
      whatsapp: "(11) 99999-8888",
      rating: 4.8,
      reviews: 127,
      distance: "2.3 km",
      status: "Aberto",
      nextAvailable: "Hoje às 14:30",
      services: ['cleaning', 'extraction', 'filling', 'orthodontics'],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Sorriso Perfeito Zona Sul",
      address: "Av. Paulista, 567 - Bela Vista",
      city: "São Paulo, SP",
      phone: "(11) 2222-3333",
      whatsapp: "(11) 88888-7777",
      rating: 4.9,
      reviews: 89,
      distance: "3.7 km",
      status: "Aberto",
      nextAvailable: "Amanhã às 09:00",
      services: ['cleaning', 'whitening', 'implants', 'orthodontics'],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Odonto Norte",
      address: "Rua do Norte, 789 - Santana",
      city: "São Paulo, SP",
      phone: "(11) 1111-2222",
      whatsapp: "(11) 77777-6666",
      rating: 4.7,
      reviews: 203,
      distance: "5.2 km",
      status: "Fechado",
      nextAvailable: "Segunda às 08:00",
      services: ['extraction', 'filling', 'implants'],
      image: "/placeholder.svg"
    }
  ];

  const filteredClinics = clinics.filter(clinic => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return clinic.name.toLowerCase().includes(searchTerm) ||
             clinic.address.toLowerCase().includes(searchTerm) ||
             clinic.city.toLowerCase().includes(searchTerm);
    }
    
    if (filters.service) {
      return clinic.services.includes(filters.service);
    }
    
    return true;
  });

  const handleCall = (phone: string, clinicName: string) => {
    toastCall("Ligação iniciada", `Discando para ${clinicName}: ${phone}`);
  };

  const handleWhatsApp = (whatsapp: string, clinicName: string) => {
    toastSuccess("WhatsApp aberto", `Iniciando conversa com ${clinicName}`);
  };

  const handleRoute = (address: string, clinicName: string) => {
    toastLocation("Rota calculada", `Abrindo GPS para ${clinicName}`);
  };

  const handleSchedule = (clinicName: string) => {
    toastAppointment("Agendamento", `Iniciando agendamento na ${clinicName}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="clinic-card" count={3} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn} flex items-center justify-between`}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Clínicas Próximas
          </h1>
          <p className="text-gray-600 mt-1">Encontre a clínica ideal para você</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredClinics.length} clínicas encontradas
        </Badge>
      </div>

      {/* Filtros */}
      <Card className={`${animations.slideInBottom} ${animations.cardHover}`}>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            availableServices={availableServices}
            placeholder="Buscar por nome, endereço ou bairro..."
            showDateFilter={false}
            showClinicFilter={false}
            showStatusFilter={false}
          />
        </CardContent>
      </Card>

      {/* Lista de Clínicas */}
      <div className="space-y-4">
        {filteredClinics.map((clinic, index) => (
          <Card 
            key={clinic.id} 
            className={`${animations.fadeIn} ${animations.cardHover} transition-all duration-300`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Imagem da Clínica */}
                <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>

                {/* Informações da Clínica */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{clinic.name}</h3>
                      <p className="text-gray-600">{clinic.address}</p>
                      <p className="text-sm text-gray-500">{clinic.city}</p>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <Badge 
                        variant={clinic.status === "Aberto" ? "default" : "secondary"}
                        className={clinic.status === "Aberto" ? "bg-green-100 text-green-800" : ""}
                      >
                        {clinic.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{clinic.rating}</span>
                        <span className="text-sm text-gray-500">({clinic.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-primary" />
                      <span>{clinic.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{clinic.nextAvailable}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{clinic.reviews} avaliações</span>
                    </div>
                  </div>

                  {/* Serviços Disponíveis */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Serviços disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.map((serviceId) => {
                        const service = availableServices.find(s => s.id === serviceId);
                        return service ? (
                          <Badge key={serviceId} variant="outline" className="text-xs">
                            {service.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={animations.buttonHover}
                      onClick={() => handleCall(clinic.phone, clinic.name)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Ligar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className={`bg-green-50 border-green-200 text-green-700 hover:bg-green-100 ${animations.buttonHover}`}
                      onClick={() => handleWhatsApp(clinic.whatsapp, clinic.name)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className={animations.buttonHover}
                      onClick={() => handleRoute(clinic.address, clinic.name)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Como Chegar
                    </Button>
                    
                    <Button
                      size="sm"
                      className={`ml-auto ${animations.buttonHover}`}
                      onClick={() => handleSchedule(clinic.name)}
                    >
                      Agendar Consulta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resultados Vazios */}
      {filteredClinics.length === 0 && (
        <Card className={`${animations.fadeIn} text-center py-12`}>
          <CardContent>
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma clínica encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros de busca ou pesquise por outra região.
            </p>
            <Button 
              variant="outline"
              onClick={() => setFilters({
                search: '',
                clinic: '',
                service: '',
                dateFrom: undefined,
                dateTo: undefined,
                status: ''
              })}
              className={animations.buttonHover}
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationsPage;
