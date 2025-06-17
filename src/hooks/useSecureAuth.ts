
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/services/security/SecurityService';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  sessionValid: boolean;
}

interface SecureLoginCredentials {
  email: string;
  password: string;
}

interface SecureRegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    sessionValid: false
  });

  useEffect(() => {
    // Initialize secure auth
    const initSecureAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          SecurityService.logSecurityEvent('session_init_error', { error: error.message });
          setAuthState(prev => ({ 
            ...prev, 
            error: error.message, 
            loading: false 
          }));
          return;
        }

        const sessionValid = await SecurityService.validateSession();
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          session,
          isAuthenticated: !!session?.user,
          sessionValid,
          loading: false,
          error: null
        }));

        if (session) {
          SecurityService.logSecurityEvent('session_restored');
        }
      } catch (error) {
        SecurityService.logSecurityEvent('auth_init_error');
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize auth', 
          loading: false 
        }));
      }
    };

    // Set up secure auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        SecurityService.logSecurityEvent('auth_state_change', { event });
        
        const sessionValid = session ? await SecurityService.validateSession() : false;
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          session,
          isAuthenticated: !!session?.user,
          sessionValid,
          loading: false,
          error: null
        }));
      }
    );

    initSecureAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const secureLogin = async (credentials: SecureLoginCredentials) => {
    // Rate limiting check
    if (!SecurityService.checkRateLimit('login', 5, 900000)) {
      SecurityService.logSecurityEvent('rate_limit_exceeded', { action: 'login' });
      return { success: false, error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' };
    }

    // Validate input
    if (!SecurityService.validateEmail(credentials.email)) {
      return { success: false, error: 'Email inválido' };
    }

    const passwordValidation = SecurityService.validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: 'Senha não atende aos critérios de segurança' };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      SecurityService.logSecurityEvent('login_attempt');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: SecurityService.sanitizeText(credentials.email),
        password: credentials.password
      });

      if (error) {
        SecurityService.logSecurityEvent('login_failed', { error: error.message });
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      SecurityService.logSecurityEvent('login_success');
      return { success: true, user: data.user };
    } catch (error) {
      SecurityService.logSecurityEvent('login_error');
      const errorMessage = 'Erro ao fazer login';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const secureRegister = async (credentials: SecureRegisterCredentials) => {
    // Rate limiting check
    if (!SecurityService.checkRateLimit('register', 3, 3600000)) {
      SecurityService.logSecurityEvent('rate_limit_exceeded', { action: 'register' });
      return { success: false, error: 'Muitas tentativas de registro. Tente novamente em 1 hora.' };
    }

    // Validate input
    if (!SecurityService.validateEmail(credentials.email)) {
      return { success: false, error: 'Email inválido' };
    }

    if (!SecurityService.validatePhone(credentials.phone)) {
      return { success: false, error: 'Telefone inválido' };
    }

    const passwordValidation = SecurityService.validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      SecurityService.logSecurityEvent('register_attempt');
      
      const { data, error } = await supabase.auth.signUp({
        email: SecurityService.sanitizeText(credentials.email),
        password: credentials.password,
        options: {
          data: {
            full_name: SecurityService.sanitizeText(credentials.full_name),
            phone: SecurityService.sanitizeText(credentials.phone)
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        SecurityService.logSecurityEvent('register_failed', { error: error.message });
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      SecurityService.logSecurityEvent('register_success');
      return { success: true, user: data.user };
    } catch (error) {
      SecurityService.logSecurityEvent('register_error');
      const errorMessage = 'Erro ao criar conta';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const secureLogout = async () => {
    try {
      SecurityService.logSecurityEvent('logout_attempt');
      await supabase.auth.signOut();
      
      // Clear any cached data
      sessionStorage.clear();
      
      SecurityService.logSecurityEvent('logout_success');
    } catch (error) {
      SecurityService.logSecurityEvent('logout_error');
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    secureLogin,
    secureRegister,
    secureLogout
  };
};
