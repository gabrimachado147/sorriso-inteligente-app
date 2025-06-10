import { toast } from 'sonner';

const whatsappApiUrl = import.meta.env.VITE_API_BASE_URL;
const whatsappToken = import.meta.env.VITE_N8N_WEBHOOK_URL;
const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL;

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

  // Processar mensagem via n8n webhook
  async processMessage(data: ChatMessage) {
    try {
      const response = await fetch(whatsappToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.message,
          sessionId: data.sessionId,
          userId: data.userId,
          context: data.context,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar mensagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro n8n webhook:', error);
      throw error;
    }
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
