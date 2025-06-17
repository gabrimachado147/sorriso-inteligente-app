
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

  return {
    clinics,
    loading,
    getClinicById,
    getClinicsByState,
    searchClinics,
    generateWhatsAppLink,
    generateMapsLink,
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
