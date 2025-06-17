
import { supabase } from '@/integrations/supabase/client';

export class AppointmentAnalytics {
  /**
   * Get appointment statistics (requires authentication)
   */
  static async getAppointmentStats() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('status, created_at, clinic');

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      const stats = {
        total: data?.length || 0,
        today: data?.filter(apt => apt.created_at.startsWith(today)).length || 0,
        thisMonth: data?.filter(apt => apt.created_at.startsWith(thisMonth)).length || 0,
        confirmed: data?.filter(apt => apt.status === 'confirmed').length || 0,
        completed: data?.filter(apt => apt.status === 'completed').length || 0,
        cancelled: data?.filter(apt => apt.status === 'cancelled').length || 0,
        byClinic: data?.reduce((acc, apt) => {
          acc[apt.clinic] = (acc[apt.clinic] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      return stats;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  }
}
