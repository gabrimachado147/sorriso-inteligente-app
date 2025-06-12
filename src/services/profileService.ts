
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  nome_completo: string;
  telefone: string;
  created_at: string;
  updated_at: string;
}

export class ProfileService {
  /**
   * Get current user profile
   */
  static async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<Pick<UserProfile, 'nome_completo' | 'telefone'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
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

  /**
   * Create profile manually if needed
   */
  static async createProfile(profileData: { nome_completo: string; telefone: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          nome_completo: profileData.nome_completo,
          telefone: profileData.telefone
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile creation failed' 
      };
    }
  }
}
