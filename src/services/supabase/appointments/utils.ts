
import type { Tables } from '@/integrations/supabase/types';
import type { RealAppointmentRecord } from './types';

type AppointmentRow = Tables<'appointments'>;

export const normalizeRealAppointment = (data: AppointmentRow): RealAppointmentRecord => ({
  id: data.id,
  name: data.name,
  phone: data.phone,
  email: data.email || undefined,
  date: data.date,
  time: data.time,
  clinic: data.clinic,
  service: data.service,
  status: data.status,
  notes: data.notes || undefined,
  source: data.source || undefined,
  created_at: data.created_at,
  updated_at: data.updated_at,
  clinic_filter: data.clinic_filter || undefined
});
