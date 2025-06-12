
import { useState } from 'react';
import { whatsappService, type ChatMessage, type WhatsAppWebhookResponse } from '@/services/whatsapp';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';

export const useChatHandler = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, context?: 'appointment' | 'general' | 'emergency'): Promise<WhatsAppWebhookResponse | null> => {
    setLoading(true);

    try {
      const sessionId = `session_${Date.now()}`;
      
      // Envia dados para o webhook e recebe resposta com campo "output"
      const response = await whatsappService.sendUserMessage({
        message,
        sessionId,
        context: context || 'general'
      });

      console.log('Chat response with output:', response);

      // Retorna a resposta estruturada
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
