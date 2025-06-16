
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { RealAppointmentService, RealAppointmentRecord } from '@/services/supabase/realAppointments';

export const useRealUserAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<RealAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userAppointments = await RealAppointmentService.getUserAppointments(user.id);
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
