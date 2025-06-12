import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filters, FilterState } from "@/components/ui/filters";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { MapPin, Phone, MessageSquare, Navigation, Clock, Users, Mail } from "lucide-react";
import { apiService } from "@/services/api";

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
  coordinates: { lat: number; lng: number };
  available: boolean;
  services: string[];
  workingHours: string;
}

interface Service {
  id: string;
  name: string;
}

const LocationsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clinic: '',
    service: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: ''
  });

  // Serviços atualizados com todos os tratamentos odontológicos
  const availableServices = [
    { id: 'avaliacao-gratuita', name: 'Avaliação Gratuita' },
    { id: 'limpeza', name: 'Limpeza Dental' },
    { id: 'restauracao', name: 'Restauração' },
    { id: 'ortodontia', name: 'Ortodontia' },
    { id: 'implantodontia', name: 'Implantodontia' },
    { id: 'estetica-dental', name: 'Estética Dental' },
    { id: 'proteses-fixas', name: 'Próteses Fixas' },
    { id: 'endodontia', name: 'Endodontia' },
    { id: 'odontopediatria', name: 'Odontopediatria' },
    { id: 'periodontia', name: 'Periodontia' },
    { id: 'urgencia', name: 'Atendimento de Urgência' }
  ];

  // Carregar clínicas reais
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setIsLoading(true);
        const clinicsData = await apiService.clinics.getAll();
        setClinics(clinicsData);
      } catch (error) {
        console.error('Erro ao carregar clínicas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClinics();
  }, []);

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
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    toastSuccess("WhatsApp aberto", `Iniciando conversa com ${clinicName}`);
  };

  const handleEmail = (email: string, clinicName: string) => {
    const subject = encodeURIComponent(`Agendamento de consulta - ${clinicName}`);
    const body = encodeURIComponent(`Olá! Gostaria de agendar uma consulta na unidade ${clinicName}. Aguardo retorno.`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
    toastSuccess("E-mail aberto", `Enviando e-mail para ${clinicName}`);
  };

  const handleRoute = (address: string, city: string, state: string, clinicName: string) => {
    const fullAddress = `${address}, ${city}, ${state}`;
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
                      <p className="text-sm text-gray-500">{clinic.city}, {clinic.state}</p>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <Badge 
                        variant={clinic.available ? "default" : "secondary"}
                        className={clinic.available ? "bg-green-100 text-green-800" : ""}
                      >
                        {clinic.available ? "Disponível" : "Indisponível"}
                      </Badge>
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
                      <span>{clinic.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Equipe especializada</span>
                    </div>
                  </div>

                  {/* Serviços Disponíveis */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Serviços disponíveis:</h4>
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
                      onClick={() => handleRoute(clinic.address, clinic.city, clinic.state, clinic.name)}
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
