
// Service for managing chat appointments using existing tables
import { supabase } from '../../integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '../../integrations/supabase/types'

export class AppointmentService {
  /**
   * Create a new lead entry (using leads_whatsapp_senhor_sorriso table)
   */
  static async createLead(lead: TablesInsert<'leads_whatsapp_senhor_sorriso'>): Promise<Tables<'leads_whatsapp_senhor_sorriso'>> {
    const { data, error } = await supabase
      .from('leads_whatsapp_senhor_sorriso')
      .insert(lead)
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Get user leads
   */
  static async getUserLeads(phone?: string): Promise<Tables<'leads_whatsapp_senhor_sorriso'>[]> {
    let query = supabase
      .from('leads_whatsapp_senhor_sorriso')
      .select('*')
      .order('created_at', { ascending: false })

    if (phone) {
      query = query.or(`phone.eq.${phone},number.eq.${phone}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user leads:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Update lead
   */
  static async updateLead(
    leadId: number, 
    updates: TablesUpdate<'leads_whatsapp_senhor_sorriso'>
  ): Promise<Tables<'leads_whatsapp_senhor_sorriso'>> {
    const { data, error } = await supabase
      .from('leads_whatsapp_senhor_sorriso')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Get lead statistics
   */
  static async getStats(): Promise<{
    total: number
    recent: number
  }> {
    const { data, error } = await supabase
      .from('leads_whatsapp_senhor_sorriso')
      .select('created_at')

    if (error) {
      console.error('Error fetching lead stats:', error)
      throw new Error(error.message)
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const recent = data?.filter(lead => 
      new Date(lead.created_at) >= yesterday
    ).length || 0

    return {
      total: data?.length || 0,
      recent
    }
  }

  /**
   * Create a contact entry
   */
  static async createContact(contact: TablesInsert<'contacts'>): Promise<Tables<'contacts'>> {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Get contacts
   */
  static async getContacts(): Promise<Tables<'contacts'>[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  /**
   * Update contact
   */
  static async updateContact(
    contactId: string, 
    updates: TablesUpdate<'contacts'>
  ): Promise<Tables<'contacts'>> {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Create chat message
   */
  static async createChatMessage(message: TablesInsert<'chat_messages'>): Promise<Tables<'chat_messages'>> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single()

    if (error) {
      console.error('Error creating chat message:', error)
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Get chat messages for a phone number
   */
  static async getChatMessages(phone: string): Promise<Tables<'chat_messages'>[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('phone', phone)
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching chat messages:', error)
      throw new Error(error.message)
    }

    return data || []
  }
}

// Export default instance for convenience
export const appointmentService = AppointmentService;
