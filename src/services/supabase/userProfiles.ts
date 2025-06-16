
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

      if (!data) return null;

      // Map the database fields to our interface
      return {
        id: data.id,
        nome_completo: data.nome_completo,
        telefone: data.telefone || undefined,
        email: data.email || undefined,
        data_nascimento: data.data_nascimento || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
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
          nome_completo: profileData.nome_completo || '',
          telefone: profileData.telefone,
          email: profileData.email,
          data_nascimento: profileData.data_nascimento
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

      const updateData: Record<string, any> = {};
      if (updates.nome_completo !== undefined) updateData.nome_completo = updates.nome_completo;
      if (updates.telefone !== undefined) updateData.telefone = updates.telefone;
      if (updates.data_nascimento !== undefined) updateData.data_nascimento = updates.data_nascimento;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
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
