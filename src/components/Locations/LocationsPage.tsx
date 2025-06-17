
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { LocationsPageHeader } from "./LocationsPageHeader";
import { ClinicCard } from "./ClinicCard";
import { LocationsFilters } from "./LocationsFilters";
import { EmptyResults } from "./EmptyResults";
import { FilterState } from "@/components/ui/filters";
import { useClinics } from "@/hooks/useClinics";

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

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { clinics: realClinics } = useClinics();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clinic: '',
    service: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: ''
  });

  // Converter dados reais para o formato da interface
  const clinics: Clinic[] = useMemo(() => {
    return realClinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      address: `Rua Principal, 123`,
      city: clinic.city,
      state: clinic.state,
      phone: '(35) 99891-3803',
      whatsapp: '5531971147487',
      email: 'contato@senhorrsorriso.com.br',
      coordinates: { lat: -21.7833, lng: -43.3500 },
      available: true,
      services: ['avaliacao-gratuita', 'limpeza', 'restauracao', 'ortodontia', 'implantodontia'],
      workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h'
    }));
  }, [realClinics]);

  // Serviços atualizados com todos os tratamentos odontológicos
  const availableServices: Service[] = [
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

  // Filtrar clínicas com base nos filtros
  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      const matchesSearch = !filters.search || 
        clinic.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        clinic.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        clinic.state.toLowerCase().includes(filters.search.toLowerCase()) ||
        clinic.address.toLowerCase().includes(filters.search.toLowerCase());

      const matchesService = !filters.service || 
        clinic.services.includes(filters.service);

      return matchesSearch && matchesService;
    });
  }, [clinics, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCall = (phone: string, clinicName: string): void => {
    const phoneNumber = phone.replace(/\D/g, '');
    window.open(`tel:${phoneNumber}`, '_self');
    toastCall("Ligação iniciada", `Discando para ${clinicName}: ${phone}`);
  };

  const handleWhatsApp = (clinicName: string): void => {
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, '_blank');
    toastSuccess("WhatsApp aberto", `Iniciando conversa com ${clinicName}`);
  };

  const handleRoute = (address: string, city: string, state: string, clinicName: string): void => {
    const fullAddress = `${address}, ${city}, ${state}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toastLocation("Rota calculada", `Abrindo GPS para ${clinicName}`);
  };

  const handleSchedule = (clinicName: string): void => {
    navigate('/schedule');
    toastAppointment("Agendamento", `Redirecionando para agendamento na ${clinicName}`);
  };

  const clearFilters = (): void => {
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
    <div className={`p-6 space-y-6 pb-24 ${animations.pageEnter}`}>
      {/* Header */}
      <LocationsPageHeader filteredClinicsCount={filteredClinics.length} />

      {/* Filtros */}
      <LocationsFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableServices={availableServices}
      />

      {/* Lista de Unidades */}
      {filteredClinics.length === 0 ? (
        <EmptyResults onClearFilters={clearFilters} />
      ) : (
        <div className="space-y-4 mb-8">
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
      )}
    </div>
  );
};

export default LocationsPage;
