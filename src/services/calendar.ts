
// Serviço para integração com calendários
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
}

export interface CalendarIntegration {
  id: string
  user_id: string
  provider: 'google' | 'apple' | 'outlook'
  access_token: string
  refresh_token?: string
  expires_at?: string
  calendar_id?: string
  is_active: boolean
}

export class CalendarService {
  // Google Calendar Integration
  static async connectGoogleCalendar(authCode: string) {
    try {
      // This would typically exchange the auth code for tokens
      const response = await fetch('/api/calendar/google/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authCode })
      })
      
      if (!response.ok) throw new Error('Failed to connect to Google Calendar')
      return await response.json()
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      throw error
    }
  }

  // Apple Calendar Integration
  static async connectAppleCalendar(credentials: any) {
    try {
      const response = await fetch('/api/calendar/apple/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) throw new Error('Failed to connect to Apple Calendar')
      return await response.json()
    } catch (error) {
      console.error('Error connecting to Apple Calendar:', error)
      throw error
    }
  }

  // Create calendar event
  static async createEvent(event: Omit<CalendarEvent, 'id'>, provider: string) {
    try {
      const response = await fetch(`/api/calendar/${provider}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
      
      if (!response.ok) throw new Error('Failed to create calendar event')
      return await response.json()
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw error
    }
  }

  // Sync appointment to calendar
  static async syncAppointmentToCalendar(appointment: any, userId: string) {
    const event: Omit<CalendarEvent, 'id'> = {
      title: `Consulta - ${appointment.service}`,
      start: new Date(`${appointment.date}T${appointment.time}`),
      end: new Date(`${appointment.date}T${appointment.time}`),
      description: `Consulta na ${appointment.clinic}. Telefone: ${appointment.phone}`,
      location: appointment.clinic
    }

    // Get user's active calendar integrations
    const integrations = await this.getUserCalendarIntegrations(userId)
    
    for (const integration of integrations) {
      if (integration.is_active) {
        await this.createEvent(event, integration.provider)
      }
    }
  }

  private static async getUserCalendarIntegrations(userId: string): Promise<CalendarIntegration[]> {
    // This would fetch from Supabase
    return []
  }
}
