
import { useState } from 'react';
import { whatsappService, type ChatMessage, type WhatsAppWebhookResponse } from '@/services/whatsapp';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';
import { WebhookAppointmentParser } from '@/services/webhookAppointmentParser';

export const useChatHandler = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (
    message: string, 
    context?: 'appointment' | 'general' | 'emergency',
    userPhone?: string
  ): Promise<WhatsAppWebhookResponse | null> => {
    setLoading(true);

    try {
      const sessionId = `session_${Date.now()}`;
      
      // Include user phone in the message context for better processing
      const enhancedMessage = userPhone 
        ? `Cliente: ${userPhone} - ${message}`
        : message;
      
      // Send data to webhook and receive response with "output" field
      const response = await whatsappService.sendUserMessage({
        message: enhancedMessage,
        sessionId,
        context: context || 'general',
        userPhone
      });

      console.log('Chat response with output:', response);

      // Process response to automatically detect appointments
      if (response.output) {
        const appointmentCreated = await WebhookAppointmentParser.processWebhookResponse({
          output: response.output,
          sessionId,
          timestamp: new Date().toISOString()
        }, userPhone);

        if (appointmentCreated) {
          console.log('Agendamento automático criado via chat!');
        }
      }

      // Return structured response
      return {
        output: response.output || 'Mensagem processada com sucesso',
        sessionId,
        threadId: `thread_${sessionId}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      toastError(
        'Erro no Chat', 
        'Não foi possível enviar a mensagem. Tente novamente.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppMessage = async (to: string, message: string) => {
    setLoading(true);

    try {
      const response = await whatsappService.sendMessage({ to, message });
      console.log('WhatsApp response with output:', response);
      return response;
    } catch (error) {
      toastError(
        'Erro WhatsApp', 
        'Não foi possível enviar mensagem via WhatsApp.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    sendWhatsAppMessage,
    loading
  };
};
