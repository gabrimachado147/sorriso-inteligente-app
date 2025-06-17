// Hook para usar dados reais de produção
import { useState, useEffect, useMemo } from 'react';
import { realClinicsService, type RealClinic, type DentalService } from '@/services/realClinicsService';

export const useProductionClinics = () => {
  const [clinics, setClinics] = useState<RealClinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular um pequeno delay para mostrar loading
    const timer = setTimeout(() => {
      setClinics(realClinicsService.getAllClinics());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getClinicById = (id: string) => realClinicsService.getClinicById(id);
  const getClinicsByState = (state: string) => realClinicsService.getClinicsByState(state);
  const searchClinics = (query: string) => realClinicsService.searchClinics(query);
  const generateWhatsAppLink = (clinicId: string, service?: string) => 
    realClinicsService.generateWhatsAppLink(clinicId, service);
  const generateMapsLink = (clinicId: string) => realClinicsService.generateMapsLink(clinicId);

  // Função para obter informações consolidadas dos horários para o chat IA
  const getOperatingHoursInfo = () => {
    return {
      weekdays: "Segunda a Sexta: 8h às 19h",
      saturdays: "Sábado: 8h às 13h",
      sundays: "Domingo: Fechado",
      full: "Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h | Domingo: Fechado"
    };
  };

  // Função para verificar se uma clínica está aberta no momento
  const isClinicOpen = (clinicId?: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = domingo, 6 = sábado

    // Domingo - fechado
    if (dayOfWeek === 0) return false;

    // Sábado - 8h às 13h
    if (dayOfWeek === 6) {
      return currentHour >= 8 && currentHour < 13;
    }

    // Segunda a sexta - 8h às 19h
    return currentHour >= 8 && currentHour < 19;
  };

  return {
    clinics,
    loading,
    getClinicById,
    getClinicsByState,
    searchClinics,
    generateWhatsAppLink,
    generateMapsLink,
    getOperatingHoursInfo,
    isClinicOpen,
    stats: realClinicsService.getClinicStats()
  };
};

export const useProductionServices = () => {
  const [services, setServices] = useState<DentalService[]>([]);

  useEffect(() => {
    setServices(realClinicsService.getAllServices());
  }, []);

  const getServiceById = (id: string) => realClinicsService.getServiceById(id);
  const getServicesByCategory = (category: string) => realClinicsService.getServicesByCategory(category);
  const getClinicServices = (clinicId: string) => realClinicsService.getClinicServices(clinicId);

  const serviceCategories = useMemo(() => {
    const categories = new Set(services.map(service => service.category));
    return Array.from(categories);
  }, [services]);

  return {
    services,
    serviceCategories,
    getServiceById,
    getServicesByCategory,
    getClinicServices
  };
};

export const useClinicSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { clinics } = useProductionClinics();

  const filteredClinics = useMemo(() => {
    let filtered = clinics;

    if (searchQuery) {
      filtered = realClinicsService.searchClinics(searchQuery);
    }

    if (selectedState) {
      filtered = filtered.filter(clinic => clinic.state === selectedState);
    }

    return filtered;
  }, [clinics, searchQuery, selectedState]);

  const availableStates = useMemo(() => {
    const states = new Set(clinics.map(clinic => clinic.state));
    return Array.from(states).sort();
  }, [clinics]);

  return {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    filteredClinics,
    availableStates,
    hasResults: filteredClinics.length > 0,
    totalResults: filteredClinics.length
  };
};

// Hook específico para fornecer informações contextuais para o chat IA
export const useChatContextData = () => {
  const { getOperatingHoursInfo, isClinicOpen, clinics } = useProductionClinics();
  const { services } = useProductionServices();

  const getChatContextInfo = () => {
    const operatingHours = getOperatingHoursInfo();
    const currentlyOpen = isClinicOpen();
    
    return {
      operatingHours,
      currentlyOpen,
      totalClinics: clinics.length,
      availableServices: services.map(s => s.name),
      locations: clinics.map(c => `${c.name} - ${c.city}/${c.state}`),
      workingHours: {
        weekdays: "8h às 19h",
        saturday: "8h às 13h",
        sunday: "Fechado"
      }
    };
  };

  return {
    getChatContextInfo
  };
};
