
// Serviço para gerenciar dados reais das clínicas
import { REAL_CLINICS_DATA, DENTAL_SERVICES } from '@/config/production';

export interface RealClinic {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  fullAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  coordinates: { lat: number; lng: number };
  available: boolean;
  services: string[];
  workingHours: string;
  specialties: string[];
  team: string;
}

export interface DentalService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
}

class RealClinicsService {
  private clinics: RealClinic[] = REAL_CLINICS_DATA;
  private services: DentalService[] = DENTAL_SERVICES;

  // Obter todas as clínicas
  getAllClinics(): RealClinic[] {
    return this.clinics.filter(clinic => clinic.available);
  }

  // Obter clínica por ID
  getClinicById(id: string): RealClinic | undefined {
    return this.clinics.find(clinic => clinic.id === id && clinic.available);
  }

  // Obter clínicas por estado
  getClinicsByState(state: string): RealClinic[] {
    return this.clinics.filter(clinic => 
      clinic.state.toLowerCase() === state.toLowerCase() && clinic.available
    );
  }

  // Obter clínicas por cidade
  getClinicsByCity(city: string): RealClinic[] {
    return this.clinics.filter(clinic => 
      clinic.city.toLowerCase().includes(city.toLowerCase()) && clinic.available
    );
  }

  // Buscar clínicas por texto
  searchClinics(query: string): RealClinic[] {
    const searchTerm = query.toLowerCase();
    return this.clinics.filter(clinic => 
      clinic.available && (
        clinic.name.toLowerCase().includes(searchTerm) ||
        clinic.city.toLowerCase().includes(searchTerm) ||
        clinic.state.toLowerCase().includes(searchTerm) ||
        clinic.address.toLowerCase().includes(searchTerm) ||
        clinic.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  // Obter clínicas próximas (simulado)
  getNearestClinics(lat: number, lng: number, maxDistance = 100): RealClinic[] {
    return this.clinics
      .filter(clinic => clinic.available)
      .map(clinic => ({
        ...clinic,
        distance: this.calculateDistance(lat, lng, clinic.coordinates.lat, clinic.coordinates.lng)
      }))
      .filter(clinic => clinic.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...clinic }) => clinic);
  }

  // Calcular distância entre coordenadas (fórmula de Haversine simplificada)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Obter todos os serviços
  getAllServices(): DentalService[] {
    return this.services;
  }

  // Obter serviço por ID
  getServiceById(id: string): DentalService | undefined {
    return this.services.find(service => service.id === id);
  }

  // Obter serviços por categoria
  getServicesByCategory(category: string): DentalService[] {
    return this.services.filter(service => 
      service.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Obter serviços disponíveis em uma clínica
  getClinicServices(clinicId: string): DentalService[] {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) return [];

    return this.services.filter(service => 
      clinic.services.includes(service.id)
    );
  }

  // Obter estatísticas das clínicas
  getClinicStats() {
    const totalClinics = this.clinics.filter(c => c.available).length;
    const stateStats = this.clinics.reduce((acc, clinic) => {
      if (clinic.available) {
        acc[clinic.state] = (acc[clinic.state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const serviceStats = this.services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClinics,
      totalServices: this.services.length,
      states: Object.keys(stateStats).length,
      stateBreakdown: stateStats,
      serviceCategories: serviceStats
    };
  }

  // Verificar se uma clínica oferece um serviço
  clinicHasService(clinicId: string, serviceId: string): boolean {
    const clinic = this.getClinicById(clinicId);
    return clinic ? clinic.services.includes(serviceId) : false;
  }

  // Obter horários de funcionamento formatados
  getFormattedWorkingHours(clinicId: string): string {
    const clinic = this.getClinicById(clinicId);
    return clinic ? clinic.workingHours : 'Horários não disponíveis';
  }

  // Gerar link do WhatsApp com mensagem personalizada
  generateWhatsAppLink(clinicId: string, service?: string): string {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) return '';

    const baseMessage = `Olá! Gostaria de agendar uma consulta na ${clinic.name}`;
    const serviceMessage = service ? ` para ${service}` : '';
    const fullMessage = `${baseMessage}${serviceMessage}. Poderia me ajudar?`;
    
    return `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(fullMessage)}`;
  }

  // Gerar link para direções no Google Maps
  generateMapsLink(clinicId: string): string {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) return '';

    const address = encodeURIComponent(clinic.fullAddress);
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  }
}

// Instância singleton
export const realClinicsService = new RealClinicsService();
