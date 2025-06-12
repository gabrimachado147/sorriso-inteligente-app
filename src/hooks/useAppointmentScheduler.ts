
import { useState } from 'react';
import { whatsappService, type AppointmentData } from '@/services/whatsapp';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const useAppointmentScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const scheduleAppointment = async (data: AppointmentData) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await whatsappService.scheduleAppointment(data);
      
      console.log('Appointment response with output:', response);
      
      toastSuccess(
        'Consulta Agendada!', 
        response.output || `Agendamento confirmado para ${data.date} às ${data.time}`
      );
      
      setSuccess(true);
      return response;
    } catch (error) {
      toastError(
        'Erro no Agendamento', 
        'Não foi possível agendar a consulta. Tente novamente.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    scheduleAppointment,
    loading,
    success
  };
};
