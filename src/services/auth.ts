/**
 * Authentication Service for Supabase Integration
 * Handles user authentication, registration, and session management
 */

import { supabase } from '../integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

export type UserProfile = Database['public']['Tables']['users']['Row'];

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            phone: credentials.phone
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create user profile in our users table
      if (data.user) {
        await this.createUserProfile(data.user, credentials);
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  /**
   * Sign in with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  /**
   * Sign out the current user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Get user profile from our users table
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to get user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string, 
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update user profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return false;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      };
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Create user profile in our users table
   */
  private static async createUserProfile(user: User, credentials: RegisterCredentials): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: credentials.name,
          phone: credentials.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to create user profile:', error);
      }
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export default instance
export const authService = AuthService;
