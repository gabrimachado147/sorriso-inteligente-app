
import { z } from 'zod';

// Schemas de validação para diferentes entidades
export const patientSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999'),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .optional(),
  
  status: z.enum(['active', 'inactive', 'pending'])
});

export const appointmentSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  
  time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  
  service: z.string()
    .min(2, 'Serviço deve ter pelo menos 2 caracteres'),
  
  clinic: z.string()
    .min(2, 'Clínica deve ter pelo menos 2 caracteres'),
  
  notes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
});

export const clinicSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  address: z.string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  
  state: z.string()
    .length(2, 'Estado deve ter 2 caracteres'),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999'),
  
  email: z.string()
    .email('Email inválido')
    .optional(),
  
  latitude: z.number()
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida')
    .optional(),
  
  longitude: z.number()
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida')
    .optional()
});

// Funções auxiliares para validação
export const validatePatient = (data: unknown) => {
  return patientSchema.safeParse(data);
};

export const validateAppointment = (data: unknown) => {
  return appointmentSchema.safeParse(data);
};

export const validateClinic = (data: unknown) => {
  return clinicSchema.safeParse(data);
};

// Sanitização de dados
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
};

export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return date;
  }
};
