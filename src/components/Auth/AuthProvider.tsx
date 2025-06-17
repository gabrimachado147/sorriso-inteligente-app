
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { errorTracker } from '@/services/errorTracking';
import { UserProfileService, UserProfile } from '@/services/supabase/userProfiles';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (auth.user) {
      try {
        const userProfile = await UserProfileService.getCurrentProfile();
        setProfile(userProfile);
      } catch (error) {
        errorTracker.reportError(error as Error, {
          component: 'AuthProvider',
          action: 'refreshProfile'
        });
      }
    } else {
      setProfile(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const result = await UserProfileService.updateProfile(data);
      if (result.success) {
        await refreshProfile();
      }
      return result;
    } catch (error) {
      errorTracker.reportError(error as Error, {
        component: 'AuthProvider',
        action: 'updateProfile'
      });
      throw error;
    }
  };

  // Wrapper functions to match the expected interface
  const signIn = async (email: string, password: string) => {
    return await auth.signIn({ email, password });
  };

  const signUp = async (email: string, password: string, userData: any) => {
    return await auth.signUp({ 
      email, 
      password, 
      nome_completo: userData.nome_completo || userData.full_name,
      telefone: userData.telefone || userData.phone 
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await refreshProfile();
      setLoading(false);
    };

    if (auth.user) {
      initAuth();
    } else {
      setLoading(false);
      setProfile(null);
    }
  }, [auth.user]);

  const value = {
    ...auth,
    loading: auth.loading || loading,
    profile,
    refreshProfile,
    updateProfile,
    signIn,
    signUp,
    signOut: auth.signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
