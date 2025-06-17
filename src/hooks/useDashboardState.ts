
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';

export const useDashboardState = () => {
  const { isAuthenticated, user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSchedulingStart = () => setSchedulingLoading(true);
  const handleSchedulingEnd = () => setSchedulingLoading(false);
  const handleChatStart = () => setChatLoading(true);
  const handleChatEnd = () => setChatLoading(false);

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
