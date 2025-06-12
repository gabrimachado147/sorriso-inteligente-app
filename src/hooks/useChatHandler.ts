
import { useState } from 'react';
import { whatsappService, ChatMessage } from '@/services/whatsapp';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';

export const useChatHandler = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, context?: 'appointment' | 'general' | 'emergency') => {
    setLoading(true);

    try {
      const sessionId = `session_${Date.now()}`;
      
      // Apenas envia os dados para o webhook, sem gerar resposta automática
      await whatsappService.sendUserMessage({
        message,
        sessionId,
        context: context || 'general'
      });

      // Confirma que a mensagem foi enviada para processamento
      return {
        success: true,
        message: 'Mensagem enviada para processamento'
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
