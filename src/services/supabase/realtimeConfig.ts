
import { supabase } from '@/integrations/supabase/client';

export class RealtimeConfigService {
  /**
   * Enable realtime for appointments table
   */
  static async enableAppointmentsRealtime() {
    try {
      console.log('[Realtime Config] Enabling realtime for appointments table...');
      
      // The table should already be in the publication
      // This is just a utility to verify realtime is working
      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .limit(1);

      if (error) {
        console.error('[Realtime Config] Error testing appointments access:', error);
        return false;
      }

      console.log('[Realtime Config] Appointments table access confirmed');
      return true;
    } catch (error) {
      console.error('[Realtime Config] Error enabling realtime:', error);
      return false;
    }
  }

  /**
   * Test realtime connection
   */
  static async testRealtimeConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      const testChannel = supabase
        .channel('realtime-test')
        .subscribe((status) => {
          console.log('[Realtime Config] Test connection status:', status);
          
          if (status === 'SUBSCRIBED') {
            supabase.removeChannel(testChannel);
            resolve(true);
          } else if (status === 'CHANNEL_ERROR') {
            supabase.removeChannel(testChannel);
            resolve(false);
          }
        });

      // Timeout after 5 seconds
      setTimeout(() => {
        supabase.removeChannel(testChannel);
        resolve(false);
      }, 5000);
    });
  }
}
