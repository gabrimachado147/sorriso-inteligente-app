
import { toast } from 'sonner';

const whatsappApiUrl = import.meta.env.VITE_API_BASE_URL;
const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL;
const USER_MESSAGE_WEBHOOK = 'https://n8nwebhook.enigmabot.store/webhook/68db7bec-7f2f-4948-be67-54fd27fb0770';

export interface WhatsAppMessage {
  to: string;
  message: string;
  sessionId?: string;
}

export interface AppointmentData {
  service: string;
  clinic: string;
  date: string;
  time: string;
  userInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface ChatMessage {
  message: string;
  sessionId: string;
  userId?: string;
  context?: 'appointment' | 'general' | 'emergency';
}

class WhatsAppService {
  // Enviar mensagem via Evolution API
  async sendMessage(data: WhatsAppMessage) {
    try {
      const response = await fetch(EVOLUTION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: data.to,
          textMessage: {
            text: data.message
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro WhatsApp API:', error);
      throw error;
    }
  }

  // Enviar dados da mensagem do usuário para o webhook (sem resposta automática)
  async sendUserMessage(data: ChatMessage) {
    try {
      const response = await fetch(USER_MESSAGE_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.message,
          sessionId: data.sessionId,
          userId: data.userId,
          context: data.context,
          timestamp: new Date().toISOString(),
          source: 'sorriso_inteligente_app'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados para webhook');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro webhook:', error);
      throw error;
    }
  }

  // Método mantido para compatibilidade, mas agora apenas envia dados sem retornar resposta
  async processMessage(data: ChatMessage) {
    return this.sendUserMessage(data);
  }

  // Agendar consulta
  async scheduleAppointment(data: AppointmentData) {
    try {
      const response = await fetch(`${whatsappApiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao agendar consulta');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro API agendamento:', error);
      throw error;
    }
  }

  // Buscar clínicas
  async getClinics(filters?: { city?: string; service?: string }) {
    try {
      const params = new URLSearchParams();
      if (filters?.city) params.append('city', filters.city);
      if (filters?.service) params.append('service', filters.service);

      const response = await fetch(`${whatsappApiUrl}/clinics?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar clínicas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro API clínicas:', error);
      throw error;
    }
  }

  // Buscar horários disponíveis
  async getAvailableSlots(clinicId: string, date: string) {
    try {
      const response = await fetch(`${whatsappApiUrl}/clinics/${clinicId}/slots?date=${date}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar horários');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro API horários:', error);
      throw error;
    }
  }
}

export const whatsappService = new WhatsAppService();
