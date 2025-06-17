
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import { AppProvider } from '@/store/AppContext';
import { AccessibilityManager } from '@/components/Accessibility/AccessibilityManager';
import { HelmetProvider } from '@/components/SEO/HelmetProvider';
import { InstallPrompt } from '@/components/PWA/InstallPrompt';
import { DevelopmentPanel } from '@/components/Layout/DevelopmentPanel';
import { errorTracker } from '@/services/errorTracking';
import { monitoringService } from '@/services/monitoring/sentryIntegration';
import { serviceWorkerManager } from '@/services/pwa/serviceWorkerManager';
import { PRODUCTION_CONFIG } from '@/config/production';

// Lazy load pages for better performance
const IndexPage = React.lazy(() => import('@/pages/Index'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const ChatPage = React.lazy(() => import('@/pages/ChatPage'));
const SchedulePage = React.lazy(() => import('@/pages/SchedulePage'));
const ClinicsPage = React.lazy(() => import('@/pages/ClinicsPage'));
const EmergencyPage = React.lazy(() => import('@/pages/EmergencyPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

// Create QueryClient with production-ready defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: PRODUCTION_CONFIG.CACHE_TTL,
      retry: PRODUCTION_CONFIG.RETRY_ATTEMPTS,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Enhanced loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 animate-pulse">Carregando Senhor Sorriso...</p>
    </div>
  </div>
);

function App() {
  React.useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Inicializando Senhor Sorriso App v3.0');
      console.log('📊 Ambiente:', import.meta.env.MODE);
      
      // Setup error tracking
      if (PRODUCTION_CONFIG.ENABLE_ERROR_TRACKING) {
        errorTracker.setupGlobalErrorHandlers();
        console.log('✅ Error tracking ativo');
      }

      // Initialize monitoring
      if (PRODUCTION_CONFIG.ENABLE_ANALYTICS) {
        monitoringService.trackEvent('user_action', {
          action: 'app_start',
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString()
        });
        console.log('✅ Monitoring ativo');
      }

      // Initialize service worker
      if (PRODUCTION_CONFIG.PWA_ENABLED) {
        const swInitialized = await serviceWorkerManager.initialize();
        if (swInitialized) {
          console.log('✅ PWA ativo');
          
          // Setup update notifications
          serviceWorkerManager.onUpdate((event) => {
            if (event.type === 'update_available') {
              console.log('🔄 Nova versão disponível');
              // You can show a toast notification here
            }
          });
        }
      }

      // Track app initialization completion
      console.log('🎉 Senhor Sorriso App inicializado com sucesso!');
      
      // Performance tracking
      if (PRODUCTION_CONFIG.PERFORMANCE_MONITORING) {
        setTimeout(() => {
          monitoringService.trackEvent('performance', {
            metric: 'app_initialization_complete',
            duration: performance.now()
          });
        }, 100);
      }
    };

    initializeApp().catch((error) => {
      console.error('❌ Erro na inicialização:', error);
      errorTracker.reportError(error, {
        component: 'App',
        action: 'initialization'
      });
    });
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityManager>
          <AppProvider>
            <AuthProvider>
              <Router>
                <div className="App min-h-screen bg-background">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<IndexPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/schedule" element={<SchedulePage />} />
                      <Route path="/clinics" element={<ClinicsPage />} />
                      <Route path="/emergency" element={<EmergencyPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                  
                  {/* Global Components */}
                  <Toaster />
                  {PRODUCTION_CONFIG.PWA_ENABLED && <InstallPrompt />}
                  {import.meta.env.DEV && <DevelopmentPanel />}
                </div>
              </Router>
            </AuthProvider>
          </AppProvider>
        </AccessibilityManager>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
