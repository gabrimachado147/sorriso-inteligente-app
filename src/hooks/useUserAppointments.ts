
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AppointmentService, AppointmentRecord } from '@/services/supabase/appointments';

export const useUserAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userAppointments = await AppointmentService.getUserAppointments(user.id);
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAppointments();
  }, [user]);

  return {
    appointments,
    loading,
    refetch: fetchUserAppointments
  };
};
