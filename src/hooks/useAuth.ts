/**
 * Authentication Hook for Sorriso Inteligente PWA
 * Provides authentication state management and user operations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  AuthService, 
  type AuthResponse, 
  type LoginCredentials, 
  type RegisterCredentials,
  type UserProfile 
} from '../services/auth';

interface UseAuthReturn {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (newPassword: string) => Promise<AuthResponse>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  clearError: () => void;
  
  // Utilities
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDentist: boolean;
  isPatient: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const currentSession = await AuthService.getCurrentSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Load user profile
          const userProfile = await AuthService.getUserProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    void initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile
          const userProfile = await AuthService.getUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      if (!response.success) {
        setError(response.error || 'Login failed');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Login failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.register(credentials);
      
      if (!response.success) {
        setError(response.error || 'Registration failed');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Registration failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.logout();
      
      if (!response.success) {
        setError(response.error || 'Logout failed');
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Logout failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      setError(null);
      
      const response = await AuthService.resetPassword(email);
      
      if (!response.success) {
        setError(response.error ?? 'Password reset failed');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Password reset failed';
      setError(error);
      return { success: false, error };
    }
  }, []);

  // Update password function
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResponse> => {
    try {
      setError(null);
      
      const response = await AuthService.updatePassword(newPassword);
      
      if (!response.success) {
        setError(response.error ?? 'Password update failed');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Password update failed';
      setError(error);
      return { success: false, error };
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const success = await AuthService.updateUserProfile(user.id, updates);
      
      if (success && profile) {
        // Update local profile state
        setProfile({ ...profile, ...updates });
      } else if (!success) {
        setError('Profile update failed');
      }
      
      return success;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Profile update failed';
      setError(error);
      return false;
    }
  }, [user, profile]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const isAuthenticated = !!session && !!user;
  const isAdmin = false; // Remove user_type since it's not in database
  const isDentist = false; // Remove user_type since it's not in database  
  const isPatient = true; // Default to patient

  return {
    // State
    user,
    profile,
    session,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
    
    // Utilities
    isAuthenticated,
    isAdmin,
    isDentist,
    isPatient
  };
};

export default useAuth;
