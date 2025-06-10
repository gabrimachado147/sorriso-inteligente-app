# API e Integrações

## Visão Geral

O **Sorriso Inteligente App** integra com múltiplos serviços para fornecer funcionalidades completas de agendamento odontológico, chat inteligente e notificações.

## Arquitetura de APIs

```
Frontend (React)
├── Supabase (Database & Auth)
├── N8N (Workflow Automation)
├── Evolution API (WhatsApp Business)
└── APIs Internas (Mock Data)
```

## Supabase Integration

### Configuração
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Tipos de Dados
```typescript
// src/integrations/supabase/types.ts
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          patient_name: string;
          patient_email: string;
          patient_phone: string;
          clinic_id: string;
          service_type: string;
          appointment_date: string;
          appointment_time: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      clinics: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          rating: number;
          specialties: string[];
          working_hours: Record<string, { open: string; close: string }>;
          emergency_available: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          duration: number; // em minutos
          price: number;
          clinic_id: string;
          created_at: string;
        };
      };
    };
  };
}
```

### Operações CRUD

#### Agendamentos
```typescript
// services/appointments.ts
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type NewAppointment = Database['public']['Tables']['appointments']['Insert'];

export const appointmentService = {
  // Criar agendamento
  async create(appointment: NewAppointment): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Buscar agendamentos do usuário
  async getUserAppointments(userEmail: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_email', userEmail)
      .order('appointment_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Atualizar status
  async updateStatus(id: string, status: Appointment['status']): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  // Cancelar agendamento
  async cancel(id: string): Promise<void> {
    await this.updateStatus(id, 'cancelled');
  },
};
```

#### Clínicas
```typescript
// services/clinics.ts
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Clinic = Database['public']['Tables']['clinics']['Row'];

export const clinicService = {
  // Buscar todas as clínicas
  async getAll(): Promise<Clinic[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Buscar clínicas por especialidade
  async getBySpecialty(specialty: string): Promise<Clinic[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .contains('specialties', [specialty])
      .order('rating', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Buscar clínicas de emergência
  async getEmergencyAvailable(): Promise<Clinic[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('emergency_available', true)
      .order('rating', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};
```

## N8N Workflow Automation

### Configuração
```typescript
// services/n8n.ts
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const n8nService = {
  // Webhook para novo agendamento
  async sendAppointmentNotification(appointment: {
    patientName: string;
    patientPhone: string;
    clinicName: string;
    date: string;
    time: string;
    service: string;
  }) {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'appointment_created',
          data: appointment,
        }),
      });

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8N service error:', error);
      throw error;
    }
  },

  // Webhook para cancelamento
  async sendCancellationNotification(appointment: {
    patientName: string;
    patientPhone: string;
    clinicName: string;
    date: string;
    time: string;
  }) {
    return this.sendWebhook({
      trigger: 'appointment_cancelled',
      data: appointment,
    });
  },

  // Método genérico para webhooks
  async sendWebhook(payload: any) {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8N webhook error:', error);
      throw error;
    }
  },
};
```

### Workflows Disponíveis

#### 1. Confirmação de Agendamento
```json
{
  "trigger": "appointment_created",
  "workflow": "send_confirmation_messages",
  "actions": [
    "send_whatsapp_to_patient",
    "send_email_to_clinic",
    "add_to_calendar"
  ]
}
```

#### 2. Lembrete de Consulta
```json
{
  "trigger": "appointment_reminder",
  "workflow": "send_reminder_24h",
  "actions": [
    "send_whatsapp_reminder",
    "send_email_reminder"
  ]
}
```

#### 3. Cancelamento
```json
{
  "trigger": "appointment_cancelled",
  "workflow": "handle_cancellation",
  "actions": [
    "notify_clinic",
    "update_calendar",
    "send_cancellation_confirmation"
  ]
}
```

## Evolution API (WhatsApp Business)

### Configuração
```typescript
// services/whatsapp.ts
const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL;

export const whatsappService = {
  // Enviar mensagem de texto
  async sendTextMessage(phone: string, message: string) {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: phone,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WhatsApp service error:', error);
      throw error;
    }
  },

  // Enviar mensagem com template
  async sendTemplateMessage(phone: string, template: string, variables: string[]) {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/sendTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: phone,
          template,
          variables,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('WhatsApp template error:', error);
      throw error;
    }
  },
};
```

### Templates de Mensagens
```typescript
// services/messageTemplates.ts
export const messageTemplates = {
  appointmentConfirmation: (data: {
    patientName: string;
    clinicName: string;
    date: string;
    time: string;
    service: string;
  }) => `
Olá ${data.patientName}! 🦷

Seu agendamento foi confirmado:

📅 **Data:** ${data.date}
🕐 **Horário:** ${data.time}
🏥 **Clínica:** ${data.clinicName}
⚕️ **Serviço:** ${data.service}

Em caso de dúvidas, entre em contato conosco.

Sorriso Inteligente App
  `.trim(),

  appointmentReminder: (data: {
    patientName: string;
    clinicName: string;
    date: string;
    time: string;
  }) => `
Olá ${data.patientName}! 🔔

Lembrete: Você tem uma consulta amanhã:

📅 **Data:** ${data.date}
🕐 **Horário:** ${data.time}
🏥 **Clínica:** ${data.clinicName}

Não esqueça de chegar 15 minutos antes!

Sorriso Inteligente App
  `.trim(),

  appointmentCancelled: (data: {
    patientName: string;
    date: string;
    time: string;
  }) => `
Olá ${data.patientName},

Seu agendamento do dia ${data.date} às ${data.time} foi cancelado com sucesso.

Você pode reagendar a qualquer momento pelo nosso app.

Sorriso Inteligente App
  `.trim(),
};
```

## APIs Mock (Desenvolvimento)

### Configuração
```typescript
// services/mockApi.ts
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

export const mockData = {
  clinics: [
    {
      id: '1',
      name: 'Clínica Sorriso Perfeito',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 99999-9999',
      email: 'contato@sorrisoperfeito.com',
      rating: 4.8,
      specialties: ['Ortodontia', 'Implantes', 'Limpeza'],
      working_hours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        // ...
      },
      emergency_available: true,
    },
    // mais clínicas...
  ],

  services: [
    {
      id: '1',
      name: 'Consulta de Rotina',
      description: 'Avaliação geral da saúde bucal',
      duration: 30,
      price: 150.00,
      clinic_id: '1',
    },
    // mais serviços...
  ],
};

export const mockApiService = {
  async getClinics() {
    if (!ENABLE_MOCK) throw new Error('Mock API disabled');
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockData.clinics;
  },

  async getServices(clinicId: string) {
    if (!ENABLE_MOCK) throw new Error('Mock API disabled');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.services.filter(service => service.clinic_id === clinicId);
  },
};
```

## Hooks de Integração

### React Query Hooks
```typescript
// hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointments';

export const useAppointments = (userEmail?: string) => {
  return useQuery({
    queryKey: ['appointments', userEmail],
    queryFn: () => appointmentService.getUserAppointments(userEmail!),
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.create,
    onSuccess: (data) => {
      // Invalidar cache de agendamentos
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      // Trigger N8N workflow
      n8nService.sendAppointmentNotification({
        patientName: data.patient_name,
        patientPhone: data.patient_phone,
        clinicName: 'Clínica',
        date: data.appointment_date,
        time: data.appointment_time,
        service: data.service_type,
      });
    },
  });
};
```

### Chat Integration Hook
```typescript
// hooks/useChatIntegration.ts
import { useState } from 'react';
import { whatsappService } from '@/services/whatsapp';

export const useChatIntegration = () => {
  const [connecting, setConnecting] = useState(false);

  const sendToWhatsApp = async (phone: string, message: string) => {
    try {
      setConnecting(true);
      await whatsappService.sendTextMessage(phone, message);
      return { success: true };
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return { success: false, error };
    } finally {
      setConnecting(false);
    }
  };

  return {
    sendToWhatsApp,
    connecting,
  };
};
```

## Error Handling

### API Error Types
```typescript
// types/api.ts
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

### Error Handling Service
```typescript
// services/errorHandler.ts
export const errorHandler = {
  handle(error: any): ApiError {
    // Supabase errors
    if (error.message && error.code) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }

    // Network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        message: 'Erro de conexão. Verifique sua internet.',
        code: 'NETWORK_ERROR',
      };
    }

    // Default error
    return {
      message: error.message || 'Erro inesperado',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  },
};
```

## Monitoramento e Logs

### API Monitoring
```typescript
// services/monitoring.ts
export const apiMonitoring = {
  logRequest(url: string, method: string, data?: any) {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`🌐 API Request: ${method} ${url}`, data);
    }
  },

  logResponse(url: string, response: any, duration: number) {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`✅ API Response: ${url} (${duration}ms)`, response);
    }
  },

  logError(url: string, error: any) {
    console.error(`❌ API Error: ${url}`, error);
    
    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      // Sentry, LogRocket, etc.
    }
  },
};
```

## Rate Limiting

### Client-side Rate Limiting
```typescript
// utils/rateLimiter.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove requests fora da janela de tempo
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
```

## Configuração de Ambientes

### Environment Variables
```bash
# Development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK_API=true
VITE_DEBUG_MODE=true

# Staging
VITE_API_BASE_URL=https://staging-api.enigmabot.store
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=true

# Production
VITE_API_BASE_URL=https://api.sorrisointeligente.com
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=false
```
