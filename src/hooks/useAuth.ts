
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  hasSession: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Singleton pattern to prevent multiple initializations
let authInitialized = false;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }

  // Fallback hook implementation
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    hasSession: false,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  useEffect(() => {
    if (authInitialized) return;
    authInitialized = true;

    console.info('useAuth: Initializing auth...');

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth: Session error:', error);
          setAuthState(prev => ({ 
            ...prev, 
            error: error.message, 
            loading: false 
          }));
          return;
        }

        console.info('useAuth: Current session:', session ? 'Found' : 'None');
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          hasSession: !!session,
          isAuthenticated: !!session?.user,
          loading: false,
          error: null
        }));

        console.info('useAuth: Auth initialization complete');
      } catch (error) {
        console.error('useAuth: Initialization error:', error);
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize auth', 
          loading: false 
        }));
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info('useAuth: Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          hasSession: !!session,
          isAuthenticated: !!session?.user,
          loading: false,
          error: null
        }));
      }
    );

    initAuth();

    return () => {
      subscription.unsubscribe();
      authInitialized = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      }
      
      return { error };
    } catch (error: any) {
      const errorMessage = 'Erro ao fazer login';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      }
      
      return { error };
    } catch (error: any) {
      const errorMessage = 'Erro ao criar conta';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      await supabase.auth.signOut();
    } catch (error) {
      console.error('useAuth: Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error: any) {
      return { error: { message: 'Erro ao enviar email de recuperação' } };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
};

export { AuthContext };
