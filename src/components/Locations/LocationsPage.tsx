
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filters, FilterState } from "@/components/ui/filters";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { MapPin, Phone, MessageSquare, Navigation, Clock, Star, Users, Mail } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  email: string;
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

  const clinics: Clinic[] = [
    {
      id: 1,
      name: "Senhor Sorriso - Campo Belo",
      address: "Avenida Afonso Pena, 151, Centro",
      city: "Campo Belo",
      state: "MG",
      zipCode: "37270-000",
      phone: "(35) 99869-5479",
      whatsapp: "(35) 99869-5479",
      email: "campobelo@senhorsorriso.com.br",
      rating: 4.8,
      reviews: 145,
      distance: "Calcular rota",
      status: "Aberto",
      nextAvailable: "Hoje às 14:30",
      services: ['cleaning', 'extraction', 'filling', 'orthodontics', 'implants'],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Senhor Sorriso - Formiga",
      address: "Rua Barão de Piumhy, 198, Centro",
      city: "Formiga",
      state: "MG",
      zipCode: "35570-128",
      phone: "(35) 9969-5479",
      whatsapp: "(35) 9969-5479",
      email: "formiga@senhorsorriso.com.br",
      rating: 4.9,
      reviews: 98,
      distance: "Calcular rota",
      status: "Aberto",
      nextAvailable: "Amanhã às 09:00",
      services: ['cleaning', 'whitening', 'implants', 'orthodontics', 'filling'],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Senhor Sorriso - Itararé",
      address: "Rua São Pedro, 1348 (Loja), Centro",
      city: "Itararé",
      state: "SP",
      zipCode: "18460-009",
      phone: "(35) 99969-5479",
      whatsapp: "(35) 99969-5479",
      email: "itarare@senhorsorriso.com.br",
      rating: 4.7,
      reviews: 76,
      distance: "Calcular rota",
      status: "Aberto",
      nextAvailable: "Hoje às 16:00",
      services: ['extraction', 'filling', 'implants', 'cleaning'],
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Senhor Sorriso - Capão Bonito",
      address: "Rua Floriano Peixoto, 732 (Super Lojas), Centro",
      city: "Capão Bonito",
      state: "SP",
      zipCode: "18300-250",
      phone: "(15) 2153-0549",
      whatsapp: "(15) 2153-0549",
      email: "capaobonito@senhorsorriso.com.br",
      rating: 4.6,
      reviews: 112,
      distance: "Calcular rota",
      status: "Aberto",
      nextAvailable: "Segunda às 08:00",
      services: ['cleaning', 'orthodontics', 'whitening', 'filling'],
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Senhor Sorriso - Itapeva",
      address: "Rua Doutor Pinheiro, 558, Centro",
      city: "Itapeva",
      state: "SP",
      zipCode: "18400-005",
      phone: "(15) 2153-0549",
      whatsapp: "(15) 2153-0549",
      email: "itapeva@senhorsorriso.com.br",
      rating: 4.8,
      reviews: 89,
      distance: "Calcular rota",
      status: "Fechado",
      nextAvailable: "Segunda às 08:00",
      services: ['cleaning', 'extraction', 'filling', 'implants', 'orthodontics'],
      image: "/placeholder.svg"
    }
  ];

  const filteredClinics = clinics.filter(clinic => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return clinic.name.toLowerCase().includes(searchTerm) ||
             clinic.address.toLowerCase().includes(searchTerm) ||
             clinic.city.toLowerCase().includes(searchTerm) ||
             clinic.state.toLowerCase().includes(searchTerm);
    }
    
    if (filters.service) {
      return clinic.services.includes(filters.service);
    }
    
    return true;
  });

  const handleCall = (phone: string, clinicName: string) => {
    const phoneNumber = phone.replace(/\D/g, '');
    window.open(`tel:${phoneNumber}`, '_self');
    toastCall("Ligação iniciada", `Discando para ${clinicName}: ${phone}`);
  };

  const handleWhatsApp = (whatsapp: string, clinicName: string) => {
    const phoneNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Gostaria de agendar uma consulta na unidade ${clinicName}.`);
    window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
    toastSuccess("WhatsApp aberto", `Iniciando conversa com ${clinicName}`);
  };

  const handleEmail = (email: string, clinicName: string) => {
    const subject = encodeURIComponent(`Agendamento de consulta - ${clinicName}`);
    const body = encodeURIComponent(`Olá! Gostaria de agendar uma consulta na unidade ${clinicName}. Aguardo retorno.`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
    toastSuccess("E-mail aberto", `Enviando e-mail para ${clinicName}`);
  };

  const handleRoute = (address: string, city: string, state: string, zipCode: string, clinicName: string) => {
    const fullAddress = `${address}, ${city}, ${state}, ${zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
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
            Unidades Senhor Sorriso
          </h1>
          <p className="text-gray-600 mt-1">Encontre a unidade mais próxima de você</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredClinics.length} unidades encontradas
        </Badge>
      </div>

      {/* Filtros */}
      <Card className={`${animations.slideInBottom} ${animations.cardHover}`}>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            availableServices={availableServices}
            placeholder="Buscar por nome, endereço, cidade ou estado..."
            showDateFilter={false}
            showClinicFilter={false}
            showStatusFilter={false}
          />
        </CardContent>
      </Card>

      {/* Lista de Unidades */}
      <div className="space-y-4">
        {filteredClinics.map((clinic, index) => (
          <Card 
            key={clinic.id} 
            className={`${animations.fadeIn} ${animations.cardHover} transition-all duration-300`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Imagem da Unidade */}
                <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <span className="text-sm font-medium text-primary">Senhor Sorriso</span>
                  </div>
                </div>

                {/* Informações da Unidade */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{clinic.name}</h3>
                      <p className="text-gray-600">{clinic.address}</p>
                      <p className="text-sm text-gray-500">{clinic.city}, {clinic.state} - CEP: {clinic.zipCode}</p>
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

                  {/* Informações de Contato */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span>{clinic.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{clinic.email}</span>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                      className={`bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 ${animations.buttonHover}`}
                      onClick={() => handleEmail(clinic.email, clinic.name)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      E-mail
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className={animations.buttonHover}
                      onClick={() => handleRoute(clinic.address, clinic.city, clinic.state, clinic.zipCode, clinic.name)}
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
              Nenhuma unidade encontrada
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
