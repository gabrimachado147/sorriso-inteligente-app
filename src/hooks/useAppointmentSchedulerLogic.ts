
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { toastError, toastAppointment } from '@/components/ui/custom-toast';
import { whatsappService } from '@/services/whatsapp';
import { format } from 'date-fns';
import { FilterState } from '@/components/ui/filters';
import { availableServices } from '@/components/Appointments/constants/services';

export const useAppointmentSchedulerLogic = (rescheduleId: string | null) => {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    clinic: '',
    service: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: ''
  });

  const [availableClinics, setAvailableClinics] = useState<Array<{id: string, name: string, city: string, state: string}>>([]);

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

  const handleConfirmAppointment = async (userPhone: string) => {
    setIsLoading(true);
    
    try {
      const selectedClinicData = availableClinics.find(c => c.id === selectedClinic);
      const selectedServiceData = availableServices.find(s => s.id === selectedService);
      
      if (!selectedDate || !selectedClinicData || !selectedServiceData) {
        throw new Error('Dados incompletos');
      }

      const appointmentDetails = `📅 *Agendamento Confirmado*\n\n` +
        `👤 *Cliente:* ${userPhone}\n` +
        `📋 *Serviço:* ${selectedServiceData.name}\n` +
        `📍 *Clínica:* ${selectedClinicData.name} - ${selectedClinicData.city}, ${selectedClinicData.state}\n` +
        `📅 *Data:* ${format(selectedDate, 'dd/MM/yyyy')}\n` +
        `⏰ *Horário:* ${selectedTime}\n\n` +
        `✅ Agendamento realizado com sucesso!\n` +
        `📞 Contato: (31) 97190-7025`;

      // Enviar confirmação para o usuário
      await whatsappService.sendMessage({
        to: userPhone,
        message: `✅ *Agendamento Confirmado!*\n\n` +
          `📋 *Serviço:* ${selectedServiceData.name}\n` +
          `📍 *Local:* ${selectedClinicData.name} - ${selectedClinicData.city}\n` +
          `📅 *Data:* ${format(selectedDate, 'dd/MM/yyyy')}\n` +
          `⏰ *Horário:* ${selectedTime}\n\n` +
          `Obrigado por escolher a Sorriso Inteligente! 😊`
      });

      // Enviar notificação para a clínica
      const clinicNumber = '+5531971907025';
      await whatsappService.sendMessage({
        to: clinicNumber,
        message: `🔔 *Novo Agendamento*\n\n${appointmentDetails}\n\n⏰ *Agendado em:* ${new Date().toLocaleString('pt-BR')}`
      });
      
      const actionText = rescheduleId ? 'Consulta reagendada' : 'Consulta agendada';
      
      toastAppointment(
        `${actionText} com sucesso!`,
        `Confirmação enviada para ${userPhone}`
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
      console.error('Erro ao confirmar agendamento:', error);
      toastError(
        'Erro ao agendar consulta',
        'Tente novamente ou entre em contato conosco.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedClinic || !selectedService) {
      toastError('Preencha todos os campos', 'Selecione data, horário, clínica e serviço.');
      return;
    }
    
    setShowPhoneModal(true);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedClinic,
    setSelectedClinic,
    selectedService,
    setSelectedService,
    isLoading,
    showPhoneModal,
    setShowPhoneModal,
    filters,
    setFilters,
    availableClinics,
    filteredServices,
    filteredClinics,
    handleConfirmAppointment,
    handleScheduleAppointment,
    handleGoBack
  };
};
