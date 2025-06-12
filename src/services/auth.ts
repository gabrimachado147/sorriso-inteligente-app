
/**
 * Simplified Authentication Service for current database schema
 * Handles user authentication without custom user tables
 */

import { supabase } from '../integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  phone?: string
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting registration with:', { 
        email: credentials.email, 
        name: credentials.name,
        phone: credentials.phone 
      });

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            nome_completo: credentials.name,
            telefone: credentials.phone
          }
        }
      })

      console.log('AuthService: Registration response:', { data, error });

      if (error) {
        console.error('AuthService: Registration error:', error);
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user || undefined }
    } catch (error) {
      console.error('AuthService: Registration exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    }
  }

  /**
   * Sign in with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting login with email:', credentials.email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      console.log('AuthService: Login response:', { data, error });

      if (error) {
        console.error('AuthService: Login error:', error);
        return { success: false, error: error.message }
      }

      console.log('AuthService: Login successful, user:', data.user?.email);
      return { success: true, user: data.user || undefined }
    } catch (error) {
      console.error('AuthService: Login exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }

  /**
   * Sign out the current user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      }
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      }
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession()
    return !!session
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { 
    valid: boolean
    errors: string[] 
  } {
    const errors: string[] = []
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Export default instance
export const authService = AuthService
