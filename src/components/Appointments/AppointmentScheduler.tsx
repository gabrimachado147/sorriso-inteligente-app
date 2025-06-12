
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Filters, FilterState } from '@/components/ui/filters';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { toastSuccess, toastError, toastAppointment } from '@/components/ui/custom-toast';
import { Calendar as CalendarIcon, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '@/services/api';

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
}

interface Service {
  id: string;
  name: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    service: 'Limpeza',
    date: '10/07/2024',
    time: '10:00',
    clinic: 'Clínica A',
    status: 'confirmed',
  },
  {
    id: 2,
    service: 'Consulta',
    date: '15/07/2024',
    time: '14:00',
    clinic: 'Clínica B',
    status: 'pending',
  },
  {
    id: 3,
    service: 'Emergência',
    date: '20/07/2024',
    time: '16:00',
    clinic: 'Clínica C',
    status: 'cancelled',
  },
];

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

  // Serviços atualizados conforme a lista fornecida
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

  // Função para gerar horários disponíveis baseado no dia da semana
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Horários base (segunda a sexta): 08:00 às 19:00
    const weekdaySlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];
    
    // Horários de sábado: 08:00 às 13:00
    const saturdaySlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00'
    ];
    
    // Domingo não funciona
    if (dayOfWeek === 0) {
      return [];
    }
    
    // Sábado - horário reduzido
    if (dayOfWeek === 6) {
      return saturdaySlots;
    }
    
    // Segunda a sexta - horário completo
    return weekdaySlots;
  };

  const timeSlots = getAvailableTimeSlots(selectedDate);

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
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
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
        {/* Seleção de Data - Layout melhorado */}
        <Card className={`${animations.slideInLeft} ${animations.cardHover}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Selecionar Data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              disabled={(date) => date < new Date() || date.getDay() === 0} // Desabilita datas passadas e domingos
              className="rounded-md border w-fit"
            />
          </CardContent>
        </Card>

        {/* Seleção de Horário - Horários atualizados */}
        <Card className={`${animations.slideInRight} ${animations.cardHover}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários Disponíveis
              {selectedDate && selectedDate.getDay() === 6 && (
                <Badge variant="secondary" className="ml-2">Sábado - Até 13:00</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {selectedDate?.getDay() === 0 ? 'Não funcionamos aos domingos' : 'Selecione uma data para ver os horários'}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`${animations.buttonHover} ${
                      selectedTime === time ? animations.scaleIn : ''
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seleção de Clínica */}
      <Card className={`${animations.fadeIn} ${animations.cardHover}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Escolher Clínica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredClinics.map((clinic) => (
              <Button
                key={clinic.id}
                variant={selectedClinic === clinic.id ? "default" : "outline"}
                className={`h-auto p-4 ${animations.buttonHover} ${
                  selectedClinic === clinic.id ? animations.scaleIn : ''
                }`}
                onClick={() => setSelectedClinic(clinic.id)}
              >
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">{clinic.name}</p>
                  <p className="text-xs text-muted-foreground">{clinic.city} - {clinic.state}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Serviço - Lista atualizada */}
      <Card className={`${animations.fadeIn} ${animations.cardHover}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Tipo de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Button
                key={service.id}
                variant={selectedService === service.id ? "default" : "outline"}
                className={`h-auto p-4 ${animations.buttonHover} ${
                  selectedService === service.id ? animations.scaleIn : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="text-center">
                  <Stethoscope className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">{service.name}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo e Confirmação */}
      {(selectedDate || selectedTime || selectedClinic || selectedService) && (
        <Card className={`${animations.scaleIn} border-primary/20 bg-primary/5`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              Resumo do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDate && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Data: {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Horário: {selectedTime}</span>
              </div>
            )}
            {selectedClinic && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Clínica: {availableClinics.find(c => c.id === selectedClinic)?.name}</span>
              </div>
            )}
            {selectedService && (
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>Serviço: {availableServices.find(s => s.id === selectedService)?.name}</span>
              </div>
            )}
            
            <Button 
              onClick={handleScheduleAppointment}
              className={`w-full mt-4 ${animations.buttonHover}`}
              disabled={!selectedDate || !selectedTime || !selectedClinic || !selectedService}
            >
              Confirmar Agendamento
            </Button>
          </CardContent>
        </Card>
      )}

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
