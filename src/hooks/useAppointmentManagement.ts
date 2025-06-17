
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  clinic: string;
}

interface UseAppointmentManagementReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  getPatientAppointments: (patientId: string) => Appointment[];
  getTodayAppointments: () => Appointment[];
  refetch: () => Promise<void>;
}

export const useAppointmentManagement = (): UseAppointmentManagementReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual Supabase query
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Maria Silva',
          date: '2024-06-18',
          time: '09:00',
          service: 'Limpeza',
          status: 'scheduled',
          clinic: 'Clínica Centro'
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'João Santos',
          date: '2024-06-18',
          time: '14:00',
          service: 'Consulta',
          status: 'confirmed',
          clinic: 'Clínica Norte'
        }
      ];
      
      setAppointments(mockAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      setError(null);
      // Mock implementation - replace with actual Supabase insert
      const newAppointment: Appointment = {
        ...appointment,
        id: Date.now().toString()
      };
      setAppointments(prev => [...prev, newAppointment]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento');
      throw err;
    }
  };

  const updateAppointment = async (id: string, updatedAppointment: Partial<Appointment>) => {
    try {
      setError(null);
      // Mock implementation - replace with actual Supabase update
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
      throw err;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      setError(null);
      await updateAppointment(id, { status: 'cancelled' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar agendamento');
      throw err;
    }
  };

  const getPatientAppointments = (patientId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getTodayAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === today);
  };

  const refetch = async () => {
    await fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getPatientAppointments,
    getTodayAppointments,
    refetch
  };
};
