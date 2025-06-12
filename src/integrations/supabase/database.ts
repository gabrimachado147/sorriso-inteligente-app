
import { supabase } from './client'
import type { Tables, TablesInsert, TablesUpdate } from './types'

export interface DatabaseError {
  message: string
  code?: string
  details?: string
}

export interface DatabaseResponse<T> {
  data: T | null
  error: DatabaseError | null
}

export interface DatabaseListResponse<T> {
  data: T[] | null
  error: DatabaseError | null
  count?: number
}

// Chat Messages operations
export const chatMessageOperations = {
  async getAll(): Promise<DatabaseListResponse<Tables<'chat_messages'>>> {
    try {
      const { data, error, count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact' })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async getById(id: number): Promise<DatabaseResponse<Tables<'chat_messages'>>> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async create(item: TablesInsert<'chat_messages'>): Promise<DatabaseResponse<Tables<'chat_messages'>>> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(item)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// Contacts operations
export const contactOperations = {
  async getAll(): Promise<DatabaseListResponse<Tables<'contacts'>>> {
    try {
      const { data, error, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async getById(id: string): Promise<DatabaseResponse<Tables<'contacts'>>> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async create(item: TablesInsert<'contacts'>): Promise<DatabaseResponse<Tables<'contacts'>>> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(item)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async update(id: string, updates: TablesUpdate<'contacts'>): Promise<DatabaseResponse<Tables<'contacts'>>> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// WhatsApp Leads operations
export const whatsappLeadOperations = {
  async getAll(): Promise<DatabaseListResponse<Tables<'leads_whatsapp_senhor_sorriso'>>> {
    try {
      const { data, error, count } = await supabase
        .from('leads_whatsapp_senhor_sorriso')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data: data || [], error: null, count: count || 0 }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async getById(id: number): Promise<DatabaseResponse<Tables<'leads_whatsapp_senhor_sorriso'>>> {
    try {
      const { data, error } = await supabase
        .from('leads_whatsapp_senhor_sorriso')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  },

  async create(item: TablesInsert<'leads_whatsapp_senhor_sorriso'>): Promise<DatabaseResponse<Tables<'leads_whatsapp_senhor_sorriso'>>> {
    try {
      const { data, error } = await supabase
        .from('leads_whatsapp_senhor_sorriso')
        .insert(item)
        .select('*')
        .single()

      if (error) {
        return { data: null, error: { message: error.message, code: error.code, details: error.details } }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

// Specialized queries for chat messages by phone
export async function getChatMessagesByPhone(phone: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('phone', phone)
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Search contacts by name or phone
export async function searchContacts(query: string) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .or(`nome.ilike.%${query}%,telefone.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Get recent leads
export async function getRecentLeads(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('leads_whatsapp_senhor_sorriso')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: null, error: { message: error.message, code: error.code, details: error.details } }
    }

    return { data: data || [], error: null }
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
