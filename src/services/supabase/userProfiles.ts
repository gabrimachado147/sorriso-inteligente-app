
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  nome_completo: string;
  telefone?: string;
  email?: string;
  data_nascimento?: string;
  created_at: string;
  updated_at: string;
}

export class UserProfileService {
  /**
   * Get current user profile
   */
  static async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      return null;
    }
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(profileData: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profileData
        }, {
          onConflict: 'id'
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<Pick<UserProfile, 'nome_completo' | 'telefone' | 'data_nascimento'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    }
  }
}
