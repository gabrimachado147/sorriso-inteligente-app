/**
 * Authentication Hook for Sorriso Inteligente PWA
 * Provides authentication state management and user operations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  AuthService, 
  type AuthResponse, 
  type LoginCredentials
} from '../services/auth';

// Simplified register credentials for our system
export interface SimpleRegisterCredentials {
  email: string;
  password: string;
  nome_completo: string;
  telefone: string;
}

interface UseAuthReturn {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: SimpleRegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (newPassword: string) => Promise<AuthResponse>;
  clearError: () => void;
  
  // Utilities
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('useAuth: Initializing auth...');
        setLoading(true);
        
        // Get current session
        const currentSession = await AuthService.getCurrentSession();
        console.log('useAuth: Current session:', currentSession);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          console.log('useAuth: User found in session:', currentSession.user.email);
        } else {
          console.log('useAuth: No user found in session');
        }
      } catch (err) {
        console.error('useAuth: Auth initialization error:', err);
        setError('Erro ao inicializar autenticação');
      } finally {
        console.log('useAuth: Auth initialization complete');
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    console.log('useAuth: Setting up auth state listener...');
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('useAuth: User signed in successfully');
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          console.log('useAuth: User signed out');
          setError(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('useAuth: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('useAuth: Starting login process...');
      console.log('useAuth: Login credentials email:', credentials.email);
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      console.log('useAuth: Login response:', response);
      
      if (!response.success) {
        console.error('useAuth: Login failed with error:', response.error);
        let errorMessage = 'Erro ao fazer login';
        
        if (response.error?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha inválidos';
        } else if (response.error?.includes('Load failed')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
        
        setError(errorMessage);
      } else {
        console.log('useAuth: Login successful in hook');
        setError(null);
      }
      
      return response;
    } catch (err) {
      console.error('useAuth: Login error:', err);
      const errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      console.log('useAuth: Login process complete, setting loading to false');
      setLoading(false);
    }
  }, []);

  // Register function - updated for email-based system
  const register = useCallback(async (credentials: SimpleRegisterCredentials): Promise<AuthResponse> => {
    try {
      console.log('useAuth: Starting registration process...');
      setLoading(true);
      setError(null);
      
      const response = await AuthService.register({
        email: credentials.email,
        password: credentials.password,
        name: credentials.nome_completo,
        phone: credentials.telefone
      });
      
      console.log('useAuth: Registration response:', response);
      
      if (!response.success) {
        let errorMessage = 'Erro ao criar conta';
        
        if (response.error?.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado';
        } else if (response.error?.includes('Load failed')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
        
        setError(errorMessage);
      } else {
        setError(null);
      }
      
      return response;
    } catch (err) {
      console.error('useAuth: Registration error:', err);
      const errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
        setError(response.error || 'Erro ao sair');
      } else {
        setUser(null);
        setSession(null);
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro ao sair';
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
        setError(response.error || 'Erro ao redefinir senha');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro ao redefinir senha';
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
        setError(response.error || 'Erro ao atualizar senha');
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro ao atualizar senha';
      setError(error);
      return { success: false, error };
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const isAuthenticated = !!session && !!user;

  // Debug logs
  console.log('useAuth: Current state:', { 
    user: user?.email, 
    hasSession: !!session, 
    loading, 
    error, 
    isAuthenticated 
  });

  return {
    // State
    user,
    session,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    clearError,
    
    // Utilities
    isAuthenticated
  };
};

export default useAuth;
