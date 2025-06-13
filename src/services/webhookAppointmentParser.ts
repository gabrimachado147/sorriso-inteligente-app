import { AppointmentService, CreateAppointmentData } from './supabase/appointments'
import { toastSuccess, toastError } from '@/components/ui/custom-toast'

export interface WebhookAppointmentData {
  output: string
  sessionId?: string
  threadId?: string
  timestamp?: string
}

export interface ParsedAppointmentData {
  name?: string
  phone?: string
  email?: string
  service?: string
  clinic?: string
  date?: string
  time?: string
  isAppointment: boolean
}

export class WebhookAppointmentParser {
  /**
   * Detecta se a resposta do webhook contém dados de agendamento
   */
  static detectAppointment(output: string): boolean {
    const appointmentKeywords = [
      'agendamento confirmado',
      'consulta agendada',
      'horário marcado',
      'appointment confirmed',
      'scheduled for',
      'confirmado para',
      'agendado para'
    ]

    return appointmentKeywords.some(keyword => 
      output.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  /**
   * Extrai dados de agendamento da resposta do webhook
   */
  static parseAppointmentData(output: string, sessionId?: string, userPhone?: string): ParsedAppointmentData {
    const isAppointment = this.detectAppointment(output)
    
    if (!isAppointment) {
      return { isAppointment: false }
    }

    // Enhanced patterns for extracting information
    const patterns = {
      name: [
        /nome[:\s]+([^,\n]+)/i,
        /paciente[:\s]+([^,\n]+)/i,
        /para[:\s]+([^,\n]+)/i,
        /cliente[:\s]+([^,\n]+)/i
      ],
      phone: [
        /telefone[:\s]+([+\d\s\(\)-]+)/i,
        /contato[:\s]+([+\d\s\(\)-]+)/i,
        /fone[:\s]+([+\d\s\(\)-]+)/i,
        /cliente[:\s]+([+\d\s\(\)-]+)/i
      ],
      service: [
        /serviço[:\s]+([^,\n]+)/i,
        /consulta[:\s]+([^,\n]+)/i,
        /procedimento[:\s]+([^,\n]+)/i,
        /avaliação[^,\n]*/i,
        /limpeza[^,\n]*/i,
        /ortodontia[^,\n]*/i
      ],
      clinic: [
        /clínica[:\s]+([^,\n]+)/i,
        /unidade[:\s]+([^,\n]+)/i,
        /local[:\s]+([^,\n]+)/i,
        /campo belo/i,
        /formiga/i,
        /itararé/i,
        /capão bonito/i,
        /itapeva/i
      ],
      date: [
        /data[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
        /dia[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
        /(\d{1,2}\/\d{1,2}\/\d{4})/
      ],
      time: [
        /horário[:\s]+(\d{1,2}:\d{2})/i,
        /hora[:\s]+(\d{1,2}:\d{2})/i,
        /às[:\s]+(\d{1,2}:\d{2})/i,
        /(\d{1,2}:\d{2})/
      ]
    }

    const extractField = (field: keyof typeof patterns): string | undefined => {
      for (const pattern of patterns[field]) {
        const match = output.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
        if (match && match[0] && field === 'service') {
          return match[0].trim()
        }
        if (match && match[0] && field === 'clinic') {
          return match[0].trim()
        }
      }
      return undefined
    }

    return {
      name: extractField('name'),
      phone: extractField('phone') || userPhone,
      service: extractField('service') || 'Consulta',
      clinic: extractField('clinic') || 'Senhor Sorriso',
      date: extractField('date'),
      time: extractField('time'),
      isAppointment: true
    }
  }

  /**
   * Processa resposta do webhook e cria agendamento se detectado
   */
  static async processWebhookResponse(
    webhookData: WebhookAppointmentData,
    userPhone?: string
  ): Promise<boolean> {
    try {
      const parsed = this.parseAppointmentData(webhookData.output, webhookData.sessionId, userPhone)
      
      if (!parsed.isAppointment) {
        return false
      }

      // Validar dados mínimos necessários
      if (!parsed.date || !parsed.time) {
        console.log('Agendamento detectado mas sem data/hora completa:', parsed)
        return false
      }

      // Preparar dados para criação
      const appointmentData: CreateAppointmentData = {
        name: parsed.name || 'Cliente via WhatsApp',
        phone: parsed.phone || userPhone || 'Não informado',
        service: parsed.service || 'Consulta',
        clinic: parsed.clinic || 'Senhor Sorriso',
        date: this.formatDate(parsed.date),
        time: parsed.time,
        webhook_session_id: webhookData.sessionId,
        notes: `Agendamento criado via webhook. Telefone: ${userPhone || 'N/A'}. Resposta original: ${webhookData.output.slice(0, 200)}...`
      }

      // Criar agendamento no Supabase
      const appointment = await AppointmentService.createAppointment(appointmentData)
      
      console.log('Agendamento criado com sucesso:', appointment)
      
      toastSuccess(
        'Agendamento Confirmado!',
        `Consulta marcada para ${appointment.date} às ${appointment.time}`
      )

      return true
    } catch (error) {
      console.error('Erro ao processar agendamento do webhook:', error)
      toastError(
        'Erro no Agendamento',
        'Não foi possível confirmar o agendamento automaticamente'
      )
      return false
    }
  }

  /**
   * Formatar data para padrão ISO (YYYY-MM-DD)
   */
  private static formatDate(dateStr: string): string {
    try {
      // Se já está no formato ISO
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr
      }

      // Se está no formato DD/MM/YYYY
      const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (match) {
        const [, day, month, year] = match
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }

      // Fallback para data atual
      return new Date().toISOString().split('T')[0]
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return new Date().toISOString().split('T')[0]
    }
  }
}
