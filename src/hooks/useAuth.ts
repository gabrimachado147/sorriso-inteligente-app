
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

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  nome_completo: string;
  telefone: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<AuthResult>;
  signUp: (credentials: RegisterCredentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.info('useAuth: Initializing auth...');

    const initAuth = async () => {
      try {
        // First, get the current session
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
        
        if (session) {
          console.info('useAuth: User data:', {
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          });
        }
        
        setSession(session);
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
        
        if (session?.user) {
          console.info('useAuth: User authenticated:', {
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          });
        }
        
        setSession(session);
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
    };
  }, []);

  const signIn = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      console.info('useAuth: Attempting sign in for:', credentials.email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        console.error('useAuth: Sign in error:', error);
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }
      
      console.info('useAuth: Sign in successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        metadata: data.user?.user_metadata
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Sign in exception:', error);
      const errorMessage = 'Erro ao fazer login';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (credentials: RegisterCredentials): Promise<AuthResult> => {
    try {
      console.info('useAuth: Attempting sign up for:', credentials.email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            nome_completo: credentials.nome_completo,
            telefone: credentials.telefone
          }
        }
      });
      
      if (error) {
        console.error('useAuth: Sign up error:', error);
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }
      
      console.info('useAuth: Sign up successful:', data.user?.email);
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Sign up exception:', error);
      const errorMessage = 'Erro ao criar conta';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      console.info('useAuth: Attempting sign out');
      setAuthState(prev => ({ ...prev, loading: true }));
      await supabase.auth.signOut();
      console.info('useAuth: Sign out successful');
    } catch (error) {
      console.error('useAuth: Sign out error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Erro ao enviar email de recuperação' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Erro ao atualizar senha' };
    }
  };

  return {
    ...authState,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    login: signIn,
    register: signUp,
    logout: signOut
  };
};

export { AuthContext };
