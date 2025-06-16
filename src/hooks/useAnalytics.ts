
import { useEffect } from 'react';
import { analyticsService } from '@/services/analytics-service';
import { useAuth } from './useAuth';

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize analytics
    analyticsService.initialize();

    // Identify user if authenticated
    if (user) {
      analyticsService.identify(user.id, {
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.nome_completo
      });
    }

    // Flush events on page unload
    const handleBeforeUnload = () => {
      analyticsService.flushEvents();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return {
    track: analyticsService.track.bind(analyticsService),
    identify: analyticsService.identify.bind(analyticsService),
    trackAppointmentCreated: analyticsService.trackAppointmentCreated.bind(analyticsService),
    trackAppointmentCancelled: analyticsService.trackAppointmentCancelled.bind(analyticsService),
    trackUserRegistration: analyticsService.trackUserRegistration.bind(analyticsService),
    trackUserLogin: analyticsService.trackUserLogin.bind(analyticsService),
    trackFeatureUsed: analyticsService.trackFeatureUsed.bind(analyticsService),
    getAnalyticsData: analyticsService.getAnalyticsData.bind(analyticsService)
  };
};
