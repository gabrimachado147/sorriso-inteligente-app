
import { useState, useEffect } from 'react';
import { UserProfileService, type UserProfile } from '@/services/supabase/userProfiles';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
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
        
        const userProfile = await UserProfileService.getCurrentProfile();
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
  const updateProfile = async (updates: Partial<Pick<UserProfile, 'full_name' | 'phone' | 'date_of_birth'>>) => {
    try {
      setError(null);
      
      const result = await UserProfileService.updateProfile(updates);
      
      if (result.success) {
        // Reload profile to get updated data
        const updatedProfile = await UserProfileService.getCurrentProfile();
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

  // Create profile function
  const createProfile = async (profileData: { full_name: string; phone?: string; date_of_birth?: string }) => {
    try {
      setError(null);
      
      const result = await UserProfileService.upsertProfile(profileData);
      
      if (result.success) {
        // Reload profile to get created data
        const newProfile = await UserProfileService.getCurrentProfile();
        setProfile(newProfile);
        return { success: true };
      } else {
        setError(result.error || 'Create failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Create failed';
      setError(error);
      return { success: false, error };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    clearError: () => setError(null)
  };
};
