import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
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
        full_name: data.full_name || '',
        phone: data.phone || undefined,
        email: user.email || undefined,
        date_of_birth: data.date_of_birth || undefined,
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
          full_name: profileData.full_name || '',
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth
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
  static async updateProfile(updates: Partial<Pick<UserProfile, 'full_name' | 'phone' | 'date_of_birth'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const updateData: Partial<UserProfile> = {};
      if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.date_of_birth !== undefined) updateData.date_of_birth = updates.date_of_birth;

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
