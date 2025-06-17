
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  fullName?: string;
  phone?: string;
}

export class AuthService {
  // Enhanced sign in with better error handling
  static async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw new Error(this.getAuthErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Login failed - no user data received');
    }

    return this.transformUser(data.user);
  }

  // Enhanced sign up with profile creation
  static async signUp(
    email: string, 
    password: string, 
    userData: { fullName: string; phone?: string }
  ): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
        },
      },
    });

    if (error) {
      throw new Error(this.getAuthErrorMessage(error.message));
    }

    if (!data.user) {
      throw new Error('Signup failed - no user data received');
    }

    return this.transformUser(data.user);
  }

  // Get current user with profile data
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch additional profile data
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, phone, preferences')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name || user.user_metadata?.full_name,
      phone: profile?.phone || user.user_metadata?.phone,
      role: user.user_metadata?.role || 'patient',
    };
  }

  // Sign out with cleanup
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Failed to sign out');
    }
  }

  // Password reset
  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      throw new Error(this.getAuthErrorMessage(error.message));
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(this.getAuthErrorMessage(error.message));
    }
  }

  // Update profile
  static async updateProfile(updates: {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: updates.fullName,
        phone: updates.phone,
        date_of_birth: updates.dateOfBirth,
        emergency_contact: updates.emergencyContact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw new Error('Failed to update profile');
    }
  }

  // Check if user has role
  static async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  // Transform Supabase user to our AuthUser type
  private static transformUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
      phone: user.user_metadata?.phone,
      role: user.user_metadata?.role || 'patient',
    };
  }

  // Get user-friendly error messages
  private static getAuthErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
    };

    return errorMap[error] || 'Erro de autenticação. Tente novamente';
  }
}
