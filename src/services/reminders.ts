
// Serviço para sistema de lembretes
import { supabase } from '@/integrations/supabase/client'

export interface Reminder {
  id: string
  appointment_id: string
  reminder_type: '24h' | '2h' | '30min'
  sent_at?: string
  method: 'push' | 'sms' | 'whatsapp' | 'email'
  status: 'pending' | 'sent' | 'failed'
  created_at: string
}

export class ReminderService {
  // Criar lembretes para um agendamento
  static async createRemindersForAppointment(appointmentId: string) {
    try {
      const reminderTypes: Array<'24h' | '2h' | '30min'> = ['24h', '2h', '30min']
      const methods: Array<'push' | 'sms' | 'whatsapp' | 'email'> = ['push', 'whatsapp']

      const reminders = []
      for (const type of reminderTypes) {
        for (const method of methods) {
          reminders.push({
            appointment_id: appointmentId,
            reminder_type: type,
            method,
            status: 'pending' as const
          })
        }
      }

      const { data, error } = await supabase
        .from('reminders')
        .insert(reminders)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating reminders:', error)
      throw error
    }
  }

  // Buscar lembretes pendentes
  static async getPendingReminders() {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          appointments(
            id,
            name,
            phone,
            date,
            time,
            clinic,
            service
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pending reminders:', error)
      return []
    }
  }

  // Processar lembretes que devem ser enviados
  static async processReminders() {
    try {
      const now = new Date()
      const reminders = await this.getPendingReminders()

      for (const reminder of reminders) {
        const appointment = reminder.appointments
        if (!appointment) continue

        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`)
        const timeDiff = appointmentDateTime.getTime() - now.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        let shouldSend = false
        
        switch (reminder.reminder_type) {
          case '24h':
            shouldSend = hoursDiff <= 24 && hoursDiff > 2
            break
          case '2h':
            shouldSend = hoursDiff <= 2 && hoursDiff > 0.5
            break
          case '30min':
            shouldSend = hoursDiff <= 0.5 && hoursDiff > 0
            break
        }

        if (shouldSend) {
          await this.sendReminder(reminder)
        }
      }
    } catch (error) {
      console.error('Error processing reminders:', error)
    }
  }

  // Enviar lembrete
  private static async sendReminder(reminder: any) {
    try {
      const appointment = reminder.appointments
      const message = this.buildReminderMessage(reminder.reminder_type, appointment)

      let success = false

      switch (reminder.method) {
        case 'whatsapp':
          success = await this.sendWhatsAppReminder(appointment.phone, message)
          break
        case 'push':
          success = await this.sendPushNotification(appointment, message)
          break
        case 'sms':
          success = await this.sendSMSReminder(appointment.phone, message)
          break
        case 'email':
          success = await this.sendEmailReminder(appointment.email, message)
          break
      }

      // Atualizar status do lembrete
      const { error } = await supabase
        .from('reminders')
        .update({
          status: success ? 'sent' : 'failed',
          sent_at: new Date().toISOString()
        })
        .eq('id', reminder.id)

      if (error) throw error

      console.log(`Reminder ${reminder.id} ${success ? 'sent' : 'failed'}`)
    } catch (error) {
      console.error('Error sending reminder:', error)
    }
  }

  private static buildReminderMessage(type: string, appointment: any): string {
    const timeText = {
      '24h': '24 horas',
      '2h': '2 horas',
      '30min': '30 minutos'
    }[type] || type

    return `🦷 Lembrete: Sua consulta na ${appointment.clinic} está em ${timeText}!

📅 Data: ${new Date(appointment.date).toLocaleDateString('pt-BR')}
🕐 Horário: ${appointment.time}
⚕️ Serviço: ${appointment.service}

Por favor, chegue 15 minutos antes do horário.

Sorriso Inteligente App`
  }

  private static async sendWhatsAppReminder(phone: string, message: string): Promise<boolean> {
    try {
      // Integração com WhatsApp API
      console.log(`Sending WhatsApp reminder to ${phone}: ${message}`)
      return true
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error)
      return false
    }
  }

  private static async sendPushNotification(appointment: any, message: string): Promise<boolean> {
    try {
      // Integração com Push Notifications
      console.log(`Sending push notification: ${message}`)
      return true
    } catch (error) {
      console.error('Error sending push notification:', error)
      return false
    }
  }

  private static async sendSMSReminder(phone: string, message: string): Promise<boolean> {
    try {
      // Integração com SMS API
      console.log(`Sending SMS to ${phone}: ${message}`)
      return true
    } catch (error) {
      console.error('Error sending SMS:', error)
      return false
    }
  }

  private static async sendEmailReminder(email: string, message: string): Promise<boolean> {
    try {
      // Integração com Email API
      console.log(`Sending email to ${email}: ${message}`)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }
}
