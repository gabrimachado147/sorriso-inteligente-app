export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          user_type: 'patient' | 'dentist' | 'admin'
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'patient' | 'dentist' | 'admin'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'patient' | 'dentist' | 'admin'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: []
      }
      clinics: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          state: string
          postal_code: string
          phone: string
          email: string | null
          website_url: string | null
          google_maps_url: string | null
          latitude: number | null
          longitude: number | null
          opening_hours: Json | null
          image_url: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          state: string
          postal_code: string
          phone: string
          email?: string | null
          website_url?: string | null
          google_maps_url?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          state?: string
          postal_code?: string
          phone?: string
          email?: string | null
          website_url?: string | null
          google_maps_url?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          clinic_id: string
          name: string
          description: string | null
          category: Database['public']['Enums']['service_category']
          price_min: number | null
          price_max: number | null
          duration_minutes: number | null
          image_url: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          clinic_id: string
          name: string
          description?: string | null
          category: Database['public']['Enums']['service_category']
          price_min?: number | null
          price_max?: number | null
          duration_minutes?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          clinic_id?: string
          name?: string
          description?: string | null
          category?: Database['public']['Enums']['service_category']
          price_min?: number | null
          price_max?: number | null
          duration_minutes?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "services_clinic_id_fkey"
            columns: ["clinic_id"]
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          }
        ]
      }
      dentists: {
        Row: {
          id: string
          user_id: string
          clinic_id: string
          cro_number: string
          specialties: string[] | null
          bio: string | null
          experience_years: number | null
          education: Json | null
          languages: string[] | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          clinic_id: string
          cro_number: string
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          education?: Json | null
          languages?: string[] | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          clinic_id?: string
          cro_number?: string
          specialties?: string[] | null
          bio?: string | null
          experience_years?: number | null
          education?: Json | null
          languages?: string[] | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dentists_clinic_id_fkey"
            columns: ["clinic_id"]
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dentists_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          dentist_id: string
          clinic_id: string
          service_id: string | null
          appointment_date: string
          duration_minutes: number | null
          status: Database['public']['Enums']['appointment_status']
          appointment_type: Database['public']['Enums']['appointment_type']
          notes: string | null
          payment_status: Database['public']['Enums']['payment_status']
          total_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          dentist_id: string
          clinic_id: string
          service_id?: string | null
          appointment_date: string
          duration_minutes?: number | null
          status?: Database['public']['Enums']['appointment_status']
          appointment_type?: Database['public']['Enums']['appointment_type']
          notes?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          dentist_id?: string
          clinic_id?: string
          service_id?: string | null
          appointment_date?: string
          duration_minutes?: number | null
          status?: Database['public']['Enums']['appointment_status']
          appointment_type?: Database['public']['Enums']['appointment_type']
          notes?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_dentist_id_fkey"
            columns: ["dentist_id"]
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          patient_id: string
          dentist_id: string | null
          clinic_id: string
          appointment_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
          is_verified: boolean
        }
        Insert: {
          id?: string
          patient_id: string
          dentist_id?: string | null
          clinic_id: string
          appointment_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
        Update: {
          id?: string
          patient_id?: string
          dentist_id?: string | null
          clinic_id?: string
          appointment_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_clinic_id_fkey"
            columns: ["clinic_id"]
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_dentist_id_fkey"
            columns: ["dentist_id"]
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pwa_installations: {
        Row: {
          id: string
          user_id: string | null
          installation_id: string
          device_info: Json | null
          installed_at: string
          last_active: string | null
          referrer: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          installation_id: string
          device_info?: Json | null
          installed_at?: string
          last_active?: string | null
          referrer?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          installation_id?: string
          device_info?: Json | null
          installed_at?: string
          last_active?: string | null
          referrer?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pwa_installations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string | null
          endpoint: string
          p256dh_key: string
          auth_key: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          endpoint: string
          p256dh_key: string
          auth_key: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          endpoint?: string
          p256dh_key?: string
          auth_key?: string
          created_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sync_queue: {
        Row: {
          id: string
          table_name: string
          record_id: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE'
          data: Json | null
          created_at: string
          processed_at: string | null
          error_message: string | null
          retry_count: number
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE'
          data?: Json | null
          created_at?: string
          processed_at?: string | null
          error_message?: string | null
          retry_count?: number
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          operation?: 'INSERT' | 'UPDATE' | 'DELETE'
          data?: Json | null
          created_at?: string
          processed_at?: string | null
          error_message?: string | null
          retry_count?: number
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          id: string
          patient_id: string
          dentist_id: string | null
          clinic_id: string
          subject: string | null
          status: 'active' | 'closed' | 'archived'
          created_at: string
          updated_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          dentist_id?: string | null
          clinic_id: string
          subject?: string | null
          status?: 'active' | 'closed' | 'archived'
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          dentist_id?: string | null
          clinic_id?: string
          subject?: string | null
          status?: 'active' | 'closed' | 'archived'
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_clinic_id_fkey"
            columns: ["clinic_id"]
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_dentist_id_fkey"
            columns: ["dentist_id"]
            referencedRelation: "dentists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          sender_id: string
          message: string
          message_type: 'text' | 'image' | 'file' | 'system'
          attachment_url: string | null
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          sender_id: string
          message: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          attachment_url?: string | null
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          sender_id?: string
          message?: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          attachment_url?: string | null
          created_at?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      service_category: 'general' | 'cosmetic' | 'orthodontics' | 'implants' | 'periodontics' | 'endodontics' | 'oral_surgery' | 'pediatric' | 'emergency'
      appointment_status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
      appointment_type: 'consultation' | 'treatment' | 'follow_up' | 'emergency' | 'cleaning'
      payment_status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Table type shortcuts
export type User = Tables<'users'>
export type Clinic = Tables<'clinics'>
export type Service = Tables<'services'>
export type Dentist = Tables<'dentists'>
export type Appointment = Tables<'appointments'>
export type Review = Tables<'reviews'>
export type PWAInstallation = Tables<'pwa_installations'>
export type PushSubscription = Tables<'push_subscriptions'>
export type SyncQueueItem = Tables<'sync_queue'>
export type ChatSession = Tables<'chat_sessions'>
export type ChatMessage = Tables<'chat_messages'>

// Insert type shortcuts
export type UserInsert = TablesInsert<'users'>
export type ClinicInsert = TablesInsert<'clinics'>
export type ServiceInsert = TablesInsert<'services'>
export type DentistInsert = TablesInsert<'dentists'>
export type AppointmentInsert = TablesInsert<'appointments'>
export type ReviewInsert = TablesInsert<'reviews'>
export type PWAInstallationInsert = TablesInsert<'pwa_installations'>
export type PushSubscriptionInsert = TablesInsert<'push_subscriptions'>
export type SyncQueueItemInsert = TablesInsert<'sync_queue'>
export type ChatSessionInsert = TablesInsert<'chat_sessions'>
export type ChatMessageInsert = TablesInsert<'chat_messages'>

// Update type shortcuts
export type UserUpdate = TablesUpdate<'users'>
export type ClinicUpdate = TablesUpdate<'clinics'>
export type ServiceUpdate = TablesUpdate<'services'>
export type DentistUpdate = TablesUpdate<'dentists'>
export type AppointmentUpdate = TablesUpdate<'appointments'>
export type ReviewUpdate = TablesUpdate<'reviews'>
export type PWAInstallationUpdate = TablesUpdate<'pwa_installations'>
export type PushSubscriptionUpdate = TablesUpdate<'push_subscriptions'>
export type SyncQueueItemUpdate = TablesUpdate<'sync_queue'>
export type ChatSessionUpdate = TablesUpdate<'chat_sessions'>
export type ChatMessageUpdate = TablesUpdate<'chat_messages'>

// Enum type shortcuts
export type ServiceCategory = Enums<'service_category'>
export type AppointmentStatus = Enums<'appointment_status'>
export type AppointmentType = Enums<'appointment_type'>
export type PaymentStatus = Enums<'payment_status'>
