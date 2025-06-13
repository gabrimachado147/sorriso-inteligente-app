
import React, { useState, useEffect } from 'react';
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { apiService } from "@/services/api";
import { FilterState } from "@/components/ui/filters";
import { LocationsPageHeader } from "./LocationsPageHeader";
import { LocationsFilters } from "./LocationsFilters";
import { ClinicCard } from "./ClinicCard";
import { EmptyResults } from "./EmptyResults";

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

  const handleWhatsApp = (clinicName: string) => {
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, '_blank');
    toastSuccess("WhatsApp aberto", `Iniciando conversa com ${clinicName}`);
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

  const handleClearFilters = () => {
    setFilters({
      search: '',
      clinic: '',
      service: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: ''
    });
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
      <LocationsPageHeader filteredClinicsCount={filteredClinics.length} />

      {/* Filtros */}
      <LocationsFilters 
        filters={filters}
        onFiltersChange={setFilters}
        availableServices={availableServices}
      />

      {/* Lista de Unidades */}
      <div className="space-y-4">
        {filteredClinics.map((clinic, index) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            index={index}
            availableServices={availableServices}
            onCall={handleCall}
            onWhatsApp={handleWhatsApp}
            onRoute={handleRoute}
            onSchedule={handleSchedule}
          />
        ))}
      </div>

      {/* Resultados Vazios */}
      {filteredClinics.length === 0 && (
        <EmptyResults onClearFilters={handleClearFilters} />
      )}
    </div>
  );
};

export default LocationsPage;
