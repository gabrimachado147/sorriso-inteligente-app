
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';

interface DashboardState {
  isAuthenticated: boolean;
  user: any; // TODO: Replace with proper User type from Supabase
  profile: any; // TODO: Replace with proper Profile type
  profileLoading: boolean;
  schedulingLoading: boolean;
  chatLoading: boolean;
}

interface DashboardActions {
  handleSchedulingStart: () => void;
  handleSchedulingEnd: () => void;
  handleChatStart: () => void;
  handleChatEnd: () => void;
}

export const useDashboardState = (): DashboardState & DashboardActions => {
  const { isAuthenticated, user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [schedulingLoading, setSchedulingLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const handleSchedulingStart = (): void => setSchedulingLoading(true);
  const handleSchedulingEnd = (): void => setSchedulingLoading(false);
  const handleChatStart = (): void => setChatLoading(true);
  const handleChatEnd = (): void => setChatLoading(false);

  // Auto-clear loading states after timeout
  useEffect(() => {
    if (schedulingLoading) {
      const timer = setTimeout(() => setSchedulingLoading(false), 5000);
      return () => clearTimeout(timer);
    }
    return () => {}; // Always return a cleanup function
  }, [schedulingLoading]);

  useEffect(() => {
    if (chatLoading) {
      const timer = setTimeout(() => setChatLoading(false), 5000);
      return () => clearTimeout(timer);
    }
    return () => {}; // Always return a cleanup function
  }, [chatLoading]);

  return {
    isAuthenticated,
    user,
    profile,
    profileLoading,
    schedulingLoading,
    chatLoading,
    handleSchedulingStart,
    handleSchedulingEnd,
    handleChatStart,
    handleChatEnd
  };
};
