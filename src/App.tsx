
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityProvider } from '@/components/Accessibility/AccessibilityProvider';
import { InstallPrompt } from '@/components/PWA/InstallPrompt';
import { PerformanceMonitor as PerfMonitor } from '@/components/Performance/PerformanceMonitor';
import { DevelopmentPanel } from '@/components/Layout/DevelopmentPanel';
import { errorTracker } from '@/services/errorTracking';
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

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  React.useEffect(() => {
    // Setup error tracking
    if (PRODUCTION_CONFIG.ENABLE_ERROR_TRACKING) {
      errorTracker.setupGlobalErrorHandlers();
    }

    // Log app initialization
    console.log('🚀 Senhor Sorriso App initialized');
    console.log('Environment:', import.meta.env.MODE);
    console.log('PWA Enabled:', PRODUCTION_CONFIG.PWA_ENABLED);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <Router>
          <div className="App">
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
            {PRODUCTION_CONFIG.PERFORMANCE_MONITORING && <PerfMonitor />}
            <DevelopmentPanel />
          </div>
        </Router>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
