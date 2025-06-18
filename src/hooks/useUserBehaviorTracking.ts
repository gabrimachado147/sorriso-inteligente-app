
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UserAction {
  type: 'click' | 'scroll' | 'page_view' | 'form_interaction' | 'error';
  element?: string;
  page: string;
  timestamp: number;
  data?: any;
}

export const useUserBehaviorTracking = () => {
  const location = useLocation();

  const trackAction = useCallback((action: Omit<UserAction, 'page' | 'timestamp'>) => {
    const userAction: UserAction = {
      ...action,
      page: location.pathname,
      timestamp: Date.now()
    };

    // Log para desenvolvimento
    console.log('🔍 User Behavior:', userAction);

    // Aqui você pode integrar com Google Analytics, Hotjar, etc.
    // Exemplo: gtag('event', action.type, { ...userAction });
    
    // Armazenar localmente para análise posterior
    const storedActions = JSON.parse(localStorage.getItem('user_actions') || '[]');
    storedActions.push(userAction);
    
    // Manter apenas os últimos 100 eventos
    if (storedActions.length > 100) {
      storedActions.splice(0, storedActions.length - 100);
    }
    
    localStorage.setItem('user_actions', JSON.stringify(storedActions));
  }, [location.pathname]);

  const trackClick = useCallback((element: string, data?: any) => {
    trackAction({ type: 'click', element, data });
  }, [trackAction]);

  const trackFormInteraction = useCallback((formField: string, action: string) => {
    trackAction({ type: 'form_interaction', element: formField, data: { action } });
  }, [trackAction]);

  const trackError = useCallback((error: string, context?: any) => {
    trackAction({ type: 'error', element: 'error', data: { error, context } });
  }, [trackAction]);

  // Track page views automaticamente
  useEffect(() => {
    trackAction({ type: 'page_view' });
  }, [location.pathname, trackAction]);

  // Track scroll behavior
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercentage > 0) {
          trackAction({ 
            type: 'scroll', 
            data: { scrollPercentage, scrollY: window.scrollY } 
          });
        }
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackAction]);

  return {
    trackClick,
    trackFormInteraction,
    trackError,
    trackAction
  };
};
