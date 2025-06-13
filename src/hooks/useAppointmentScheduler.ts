
import { useState } from 'react';
import { whatsappService, type AppointmentData } from '@/services/whatsapp';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { useGamification } from './useGamification';
import { useHealthAnalytics } from './useHealthAnalytics';
import { WebhookAppointmentParser } from '@/services/webhookAppointmentParser';

export const useAppointmentScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addPoints, updateStreak } = useGamification();
  const { addHealthMetric } = useHealthAnalytics();

  const scheduleAppointment = async (data: AppointmentData) => {
    setLoading(true);
    setSuccess(false);

    try {
      // Enviar para o webhook
      const response = await whatsappService.scheduleAppointment(data);
      
      console.log('Appointment response with output:', response);
      
      // Verificar se o serviço existe antes de usar
      const service = data.service || 'Consulta';
      
      // Processar resposta do webhook para detectar agendamento
      const appointmentCreated = await WebhookAppointmentParser.processWebhookResponse(
        {
          output: response.output || 'Agendamento processado',
          sessionId: `session_${Date.now()}`,
          timestamp: new Date().toISOString()
        },
        data.phone
      );

      if (appointmentCreated) {
        console.log('Agendamento real criado no Supabase!');
      }
      
      // Adicionar pontos de gamificação
      const points = service === 'Avaliação Gratuita' ? 50 : 
                   service.includes('Limpeza') ? 75 : 100;
      
      addPoints(points, `Consulta agendada: ${service}`, 'appointment');
      updateStreak(true);

      // Registrar no analytics de saúde
      addHealthMetric({
        type: service.includes('Limpeza') ? 'cleaning' : 
              service.includes('Avaliação') ? 'checkup' : 'appointment',
        service: service
      });
      
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
