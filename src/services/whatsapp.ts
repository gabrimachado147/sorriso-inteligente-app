// WhatsApp webhook service
export interface WhatsAppMessage {
  phone: string
  message: string
  name?: string
  timestamp?: string
}

export interface WhatsAppWebhookData {
  phone: string
  message: string
  name?: string
  sessionId?: string
  threadId?: string
}

export interface WhatsAppWebhookResponse {
  output: string
  sessionId?: string
  threadId?: string
  timestamp?: string
}

export interface AppointmentData {
  name: string
  phone: string
  date: string
  time: string
  service?: string
}

export interface ChatMessage {
  id: string
  phone: string
  message: string
  type: 'user' | 'bot'
  timestamp: string
}

export class WhatsAppService {
  private static readonly WEBHOOK_URL = 'https://n8nwebhook.enigmabot.store/webhook/9598a25e-5915-4fe1-b136-90cbcc05bbe0'

  /**
   * Send message data to webhook and receive response
   */
  static async sendToWebhook(data: WhatsAppWebhookData): Promise<WhatsAppWebhookResponse> {
    try {
      console.log('Enviando dados para webhook N8N:', data)
      
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Webhook N8N falhou: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Resposta do webhook N8N recebida:', result)
      
      // O webhook retorna um array, então vamos pegar o primeiro item
      let webhookData = result
      if (Array.isArray(result) && result.length > 0) {
        webhookData = result[0]
      }
      
      // Garantir que a resposta tenha o campo "output"
      const webhookResponse: WhatsAppWebhookResponse = {
        output: webhookData.output || webhookData.message || 'Resposta recebida do N8N com sucesso',
        sessionId: webhookData.sessionId || data.sessionId,
        threadId: webhookData.threadId || data.threadId,
        timestamp: new Date().toISOString()
      }

      console.log('Resposta formatada do webhook N8N:', webhookResponse)
      return webhookResponse
    } catch (error) {
      console.error('Erro ao enviar dados para webhook N8N:', error)
      throw error
    }
  }

  /**
   * Process incoming WhatsApp message and return response
   */
  static async processMessage(message: WhatsAppMessage): Promise<WhatsAppWebhookResponse> {
    const webhookData: WhatsAppWebhookData = {
      phone: message.phone,
      message: message.message,
      name: message.name,
      sessionId: `session_${message.phone}_${Date.now()}`,
      threadId: `thread_${message.phone}_${Date.now()}`
    }

    return await this.sendToWebhook(webhookData)
  }

  /**
   * Send response back to WhatsApp (placeholder for actual implementation)
   */
  static async sendResponse(phone: string, message: string): Promise<void> {
    console.log(`Sending response to ${phone}: ${message}`)
    // This would integrate with actual WhatsApp API
    // For now, it's just a placeholder
  }

  /**
   * Schedule appointment via webhook
   */
  static async scheduleAppointment(data: AppointmentData): Promise<{ success: boolean; message: string; output?: string }> {
    try {
      const webhookData: WhatsAppWebhookData = {
        phone: data.phone,
        message: `Agendamento: ${data.name} - ${data.date} às ${data.time}${data.service ? ` - ${data.service}` : ''}`,
        sessionId: `appointment_${Date.now()}`,
        threadId: `thread_appointment_${Date.now()}`
      }

      const response = await this.sendToWebhook(webhookData)

      return {
        success: true,
        message: 'Appointment scheduled successfully',
        output: response.output
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      throw error
    }
  }

  /**
   * Send user message to webhook for processing and return formatted response
   */
  static async sendUserMessage(data: {
    message: string
    sessionId: string
    context?: string
    userPhone?: string
  }): Promise<{ success: boolean; message: string; output?: string }> {
    try {
      const webhookData: WhatsAppWebhookData = {
        phone: data.userPhone || 'user-app', // Use user phone if provided
        message: data.message,
        sessionId: data.sessionId,
        threadId: `thread_${data.sessionId}`,
        name: data.userPhone ? `Cliente ${data.userPhone}` : 'Cliente App'
      }

      const response = await this.sendToWebhook(webhookData)

      return {
        success: true,
        message: 'Message sent for processing',
        output: response.output
      }
    } catch (error) {
      console.error('Error sending user message:', error)
      throw error
    }
  }

  /**
   * Send WhatsApp message via API
   */
  static async sendMessage(data: { to: string; message: string }): Promise<{ success: boolean; response: unknown }> {
    try {
      console.log(`Sending WhatsApp message to ${data.to}: ${data.message}`)
      
      const webhookData: WhatsAppWebhookData = {
        phone: data.to,
        message: data.message,
        sessionId: `whatsapp_${Date.now()}`,
        threadId: `thread_whatsapp_${Date.now()}`
      }

      const response = await this.sendToWebhook(webhookData)

      return { success: true, response: webhookData }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw error
    }
  }
}

export const whatsappService = WhatsAppService
