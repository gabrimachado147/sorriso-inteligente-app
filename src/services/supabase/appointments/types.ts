
export interface RealAppointmentRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  clinic: string;
  service: string;
  status: string;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  clinic_filter?: string;
}

export interface CreateRealAppointmentData {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  clinic: string;
  service: string;
  status?: string;
  notes?: string;
  source?: string;
  webhook_session_id?: string;
}

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';
