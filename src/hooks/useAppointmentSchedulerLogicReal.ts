
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { useClinics } from './useClinics';
import { useAppointmentValidation } from './useAppointmentValidation';
import { RealAppointmentService } from '@/services/supabase/realAppointments';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const useAppointmentSchedulerLogicReal = (rescheduleId: string | null) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { profile } = useUserProfile();
  const { clinics } = useClinics();
  const [searchParams] = useSearchParams();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const formData = { selectedDate, selectedTime, selectedClinic, selectedService };
  const { isFormValid, validateForm } = useAppointmentValidation(formData);

  // Detectar serviço pré-selecionado via URL
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl && !selectedService) {
      setSelectedService(serviceFromUrl);
    }
  }, [searchParams, selectedService]);

  const handleScheduleAppointment = () => {
    if (!validateForm()) {
      toastError('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Se usuário está logado, usar dados do perfil automaticamente
    if (isAuthenticated && profile) {
      handleConfirmAppointment(profile.full_name, profile.phone || '');
    } else {
      // Se não está logado, mostrar modal para capturar dados
      setShowPhoneModal(true);
    }
  };

  const handleConfirmAppointment = async (name?: string, phone?: string) => {
    try {
      setIsLoading(true);

      const selectedClinicData = clinics.find(c => c.id === selectedClinic);
      
      // Preparar dados do agendamento para o Supabase
      const appointmentData = {
        name: name || profile?.full_name || '',
        phone: phone || profile?.phone || '',
        date: selectedDate!.toISOString().split('T')[0],
        time: selectedTime,
        clinic: selectedClinicData ? `${selectedClinicData.name} - ${selectedClinicData.city}` : '',
        service: selectedService,
        email: user?.email || '',
        source: 'pwa',
        status: 'confirmed' as const
      };

      console.log('Creating real appointment with data:', appointmentData);

      // Criar o agendamento no Supabase
      const result = await RealAppointmentService.createAppointment(appointmentData);

      // Se usuário está logado, criar vínculo na tabela user_appointments
      if (isAuthenticated && user) {
        await RealAppointmentService.linkUserAppointment(user.id, result.id);
      }

      setShowPhoneModal(false);
      
      toastSuccess(
        rescheduleId ? 'Consulta Reagendada!' : 'Consulta Agendada!',
        `Sua consulta foi ${rescheduleId ? 'reagendada' : 'agendada'} para ${appointmentData.date} às ${appointmentData.time}`
      );

      // Limpar formulário
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedClinic('');
      setSelectedService('');

      // Redirecionar após sucesso
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/profile');
        } else {
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      console.error('Erro ao agendar consulta no Supabase:', error);
      toastError('Erro', 'Não foi possível agendar a consulta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
    availableClinics: clinics,
    isFormValid,
    handleConfirmAppointment,
    handleScheduleAppointment,
    handleGoBack
  };
};
