
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastCall, toastLocation, toastAppointment } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { apiService } from "@/services/api";
import { LocationsPageHeader } from "./LocationsPageHeader";
import { ClinicCard } from "./ClinicCard";

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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);

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
    navigate('/schedule');
    toastAppointment("Agendamento", `Redirecionando para agendamento na ${clinicName}`);
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
      <LocationsPageHeader filteredClinicsCount={clinics.length} />

      {/* Lista de Unidades */}
      <div className="space-y-4">
        {clinics.map((clinic, index) => (
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
    </div>
  );
};

export default LocationsPage;
