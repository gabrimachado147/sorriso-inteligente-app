export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          clinic_id: string | null
          created_at: string
          data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          clinic: string
          created_at: string
          date: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          service: string
          source: string | null
          status: string
          time: string
          updated_at: string
          webhook_session_id: string | null
        }
        Insert: {
          clinic: string
          created_at?: string
          date: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          service: string
          source?: string | null
          status?: string
          time: string
          updated_at?: string
          webhook_session_id?: string | null
        }
        Update: {
          clinic?: string
          created_at?: string
          date?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          service?: string
          source?: string | null
          status?: string
          time?: string
          updated_at?: string
          webhook_session_id?: string | null
        }
        Relationships: []
      }
      BDR_PROSPECÇÃO: {
        Row: {
          created_at: string
          "Data de cadastro": string | null
          id: number
          lead_name: string | null
          number: string | null
          SessionId: string | null
          thread_id: string | null
          timeout: string | null
        }
        Insert: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          lead_name?: string | null
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Update: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          lead_name?: string | null
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Relationships: []
      }
      "BDR_PROSPECÇÃO [SENHOR SORRISO]": {
        Row: {
          created_at: string
          Historico_conversas: string | null
          Hora_desejada: string | null
          id: number
          lead_name: string | null
          number: string | null
          thread_id: string | null
          timeout: string | null
          whatsappid: string | null
        }
        Insert: {
          created_at?: string
          Historico_conversas?: string | null
          Hora_desejada?: string | null
          id?: number
          lead_name?: string | null
          number?: string | null
          thread_id?: string | null
          timeout?: string | null
          whatsappid?: string | null
        }
        Update: {
          created_at?: string
          Historico_conversas?: string | null
          Hora_desejada?: string | null
          id?: number
          lead_name?: string | null
          number?: string | null
          thread_id?: string | null
          timeout?: string | null
          whatsappid?: string | null
        }
        Relationships: []
      }
      calendar_integrations: {
        Row: {
          access_token: string
          calendar_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          calendar_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          calendar_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      click_id: {
        Row: {
          click_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          click_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          click_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      clinic_schedules: {
        Row: {
          clinic_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          clinic_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_schedules_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          state: string
          updated_at: string
          working_hours: Json | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          state: string
          updated_at?: string
          working_hours?: Json | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          state?: string
          updated_at?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          click_id: string | null
          created_at: string | null
          email: string | null
          empresa: string | null
          id: string
          nome: string | null
          objetivo: string | null
          stage: string | null
          telefone: string | null
        }
        Insert: {
          click_id?: string | null
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          objetivo?: string | null
          stage?: string | null
          telefone?: string | null
        }
        Update: {
          click_id?: string | null
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          objetivo?: string | null
          stage?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          telefone: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      "Data de cadastro": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      LEADS: {
        Row: {
          created_at: string
          "Data de cadastro": string | null
          id: number
          lead_name: string | null
          name: string | null
          number: string | null
          SessionId: string | null
          thread_id: string | null
          timeout: string | null
          Whastapp: string | null
        }
        Insert: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Update: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Relationships: []
      }
      Leads_dr_fitness: {
        Row: {
          created_at: string
          id: number
          number: string | null
          thread_id: string | null
          timeout: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          number?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          number?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Relationships: []
      }
      leads_whatsapp: {
        Row: {
          chatInput: string | null
          created_at: string
          data_de_cadastro: string | null
          id: number
          lead_name: string | null
          name: string | null
          number: string | null
          phone: string | null
          sessionId: string | null
          thread_id: string | null
          timeout: string | null
          Whastapp: string | null
        }
        Insert: {
          chatInput?: string | null
          created_at?: string
          data_de_cadastro?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          sessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Update: {
          chatInput?: string | null
          created_at?: string
          data_de_cadastro?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          sessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Relationships: []
      }
      leads_whatsapp_senhor_sorriso: {
        Row: {
          chatInput: string | null
          created_at: string
          data_de_cadastro: string | null
          id: number
          lead_name: string | null
          name: string | null
          number: string | null
          phone: string | null
          sessionId: string | null
          thread_id: string | null
          timeout: string | null
          Whastapp: string | null
        }
        Insert: {
          chatInput?: string | null
          created_at?: string
          data_de_cadastro?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          sessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Update: {
          chatInput?: string | null
          created_at?: string
          data_de_cadastro?: string | null
          id?: number
          lead_name?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          sessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
          Whastapp?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome_completo: string
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nome_completo: string
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_completo?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          method: string
          reminder_type: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          method: string
          reminder_type: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          method?: string
          reminder_type?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string | null
          clinic_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          clinic_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          clinic_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      SessionID: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      SUPORTE: {
        Row: {
          created_at: string
          "Data de cadastro": string | null
          id: number
          number: string | null
          SessionId: string | null
          thread_id: string | null
          timeout: string | null
        }
        Insert: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Update: {
          created_at?: string
          "Data de cadastro"?: string | null
          id?: number
          number?: string | null
          SessionId?: string | null
          thread_id?: string | null
          timeout?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string | null
          id: string
          medical_notes: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          id: string
          medical_notes?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          id?: string
          medical_notes?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
