
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Filters, FilterState } from '@/components/ui/filters';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { toastError, toastAppointment } from '@/components/ui/custom-toast';
import { Calendar as CalendarIcon } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '@/services/api';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { AppointmentSummary } from './AppointmentSummary';

interface Appointment {
  id: number;
  service: string;
  date: string;
  time: string;
  clinic: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Service {
  id: string;
  name: string;
}

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('reschedule');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clinic: '',
    service: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: ''
  });

  const [availableClinics, setAvailableClinics] = useState<Array<{id: string, name: string, city: string, state: string}>>([]);

  const availableServices = [
    { id: 'avaliacao-gratuita', name: 'Avaliação Gratuita' },
    { id: 'limpeza', name: 'Limpeza' },
    { id: 'restauracao', name: 'Restauração' },
    { id: 'ortodontia', name: 'Ortodontia' },
    { id: 'implantodontia', name: 'Implantodontia' },
    { id: 'estetica-dental', name: 'Estética Dental' },
    { id: 'proteses-fixa', name: 'Próteses Fixa' },
    { id: 'endodontia', name: 'Endodontia' },
    { id: 'odontopediatria', name: 'Odontopediatria' },
    { id: 'periodontia', name: 'Periodontia' },
    { id: 'urgencia', name: 'Atendimento de Urgência' }
  ];

  // Carregar clínicas reais ao montar o componente
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setIsLoading(true);
        const clinics = await apiService.clinics.getAll();
        const formattedClinics = clinics.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          city: clinic.city,
          state: clinic.state
        }));
        setAvailableClinics(formattedClinics);
      } catch (error) {
        console.error('Erro ao carregar clínicas:', error);
        toastError('Erro', 'Não foi possível carregar as clínicas');
      } finally {
        setIsLoading(false);
      }
    };

    loadClinics();
  }, []);

  // Resetar horário selecionado quando a data mudar
  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate]);

  const filteredServices = availableServices.filter(service => {
    if (filters.search) {
      return service.name.toLowerCase().includes(filters.search.toLowerCase());
    }
    if (filters.service) {
      return service.id === filters.service;
    }
    return true;
  });

  const filteredClinics = availableClinics.filter(clinic => {
    if (filters.search) {
      return clinic.name.toLowerCase().includes(filters.search.toLowerCase());
    }
    if (filters.clinic) {
      return clinic.id === filters.clinic;
    }
    return true;
  });

  const handleConfirmAppointment = async () => {
    setIsLoading(true);
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedClinicName = availableClinics.find(c => c.id === selectedClinic)?.name;
      const selectedServiceName = availableServices.find(s => s.id === selectedService)?.name;
      
      const actionText = rescheduleId ? 'Consulta reagendada' : 'Consulta agendada';
      
      toastAppointment(
        `${actionText} com sucesso!`,
        `${selectedServiceName} em ${selectedClinicName} no dia ${format(selectedDate!, 'dd/MM/yyyy')} às ${selectedTime}`
      );
      
      // Reset form and navigate back
      setSelectedTime('');
      setSelectedClinic('');
      setSelectedService('');
      setSelectedDate(new Date());
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      toastError(
        'Erro ao agendar consulta',
        'Tente novamente ou entre em contato conosco.'
      );
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedClinic || !selectedService) {
      toastError('Preencha todos os campos', 'Selecione data, horário, clínica e serviço.');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className={`p-6 space-y-6 ${animations.fadeIn}`}>
        <EnhancedSkeleton variant="appointment-card" count={3} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          {rescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
        </h1>
        <Button variant="outline" onClick={handleGoBack} className={animations.buttonHover}>
          Voltar
        </Button>
      </div>

      {rescheduleId && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-blue-800">
              <strong>Reagendamento:</strong> Você está alterando a consulta #{rescheduleId}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card className={animations.fadeIn}>
        <CardContent className="p-6">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            availableClinics={availableClinics}
            availableServices={availableServices}
            placeholder="Buscar clínicas ou serviços..."
            showStatusFilter={false}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateSelector 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        <TimeSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      </div>

      <ClinicSelector
        selectedClinic={selectedClinic}
        onClinicSelect={setSelectedClinic}
        filteredClinics={filteredClinics}
      />

      <ServiceSelector
        selectedService={selectedService}
        onServiceSelect={setSelectedService}
        filteredServices={filteredServices}
      />

      <AppointmentSummary
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedClinic={selectedClinic}
        selectedService={selectedService}
        availableClinics={availableClinics}
        availableServices={availableServices}
        onConfirm={handleScheduleAppointment}
      />

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAppointment}
        type="appointment"
        data={{
          date: selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : '',
          time: selectedTime,
          clinic: availableClinics.find(c => c.id === selectedClinic)?.name || '',
          service: availableServices.find(s => s.id === selectedService)?.name || ''
        }}
      />
    </div>
  );
};

export default AppointmentScheduler;
