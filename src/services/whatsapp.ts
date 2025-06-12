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

export class WhatsAppService {
  private static readonly WEBHOOK_URL = 'https://n8nwebhook.enigmabot.store/webhook/9598a25e-5915-4fe1-b136-90cbcc05bbe0'

  /**
   * Send message data to webhook
   */
  static async sendToWebhook(data: WhatsAppWebhookData): Promise<void> {
    try {
      console.log('Sending data to webhook:', data)
      
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`)
      }

      console.log('Data sent to webhook successfully')
    } catch (error) {
      console.error('Error sending data to webhook:', error)
      throw error
    }
  }

  /**
   * Process incoming WhatsApp message
   */
  static async processMessage(message: WhatsAppMessage): Promise<void> {
    const webhookData: WhatsAppWebhookData = {
      phone: message.phone,
      message: message.message,
      name: message.name,
      sessionId: `session_${message.phone}_${Date.now()}`,
      threadId: `thread_${message.phone}_${Date.now()}`
    }

    await this.sendToWebhook(webhookData)
  }

  /**
   * Send response back to WhatsApp (placeholder for actual implementation)
   */
  static async sendResponse(phone: string, message: string): Promise<void> {
    console.log(`Sending response to ${phone}: ${message}`)
    // This would integrate with actual WhatsApp API
    // For now, it's just a placeholder
  }
}

export const whatsappService = WhatsAppService
