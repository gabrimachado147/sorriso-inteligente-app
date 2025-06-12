
import { useState, useEffect } from 'react';
import { ProfileService, type UserProfile } from '@/services/profileService';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load profile when user is available
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userProfile = await ProfileService.getCurrentProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Update profile function
  const updateProfile = async (updates: Partial<Pick<UserProfile, 'nome_completo' | 'telefone'>>) => {
    try {
      setError(null);
      
      const result = await ProfileService.updateProfile(updates);
      
      if (result.success) {
        // Reload profile to get updated data
        const updatedProfile = await ProfileService.getCurrentProfile();
        setProfile(updatedProfile);
        return { success: true };
      } else {
        setError(result.error || 'Update failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Update failed';
      setError(error);
      return { success: false, error };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    clearError: () => setError(null)
  };
};
