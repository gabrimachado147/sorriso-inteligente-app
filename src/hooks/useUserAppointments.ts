
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AppointmentService, type AppointmentRecord } from '@/services/supabase/appointments';

export const useUserAppointments = () => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAppointments = async () => {
      if (!isAuthenticated || !user) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userAppointments = await AppointmentService.getUserAppointments(user.id);
        setAppointments(userAppointments);
      } catch (err) {
        console.error('Error loading user appointments:', err);
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    loadUserAppointments();
  }, [user, isAuthenticated]);

  const refreshAppointments = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setError(null);
      const userAppointments = await AppointmentService.getUserAppointments(user.id);
      setAppointments(userAppointments);
    } catch (err) {
      console.error('Error refreshing appointments:', err);
      setError('Erro ao atualizar agendamentos');
    }
  };

  return {
    appointments,
    loading,
    error,
    refreshAppointments
  };
};
