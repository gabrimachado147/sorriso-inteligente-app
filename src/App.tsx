
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import SchedulePage from "./pages/SchedulePage";
import ClinicsPage from "./pages/ClinicsPage";
import EmergencyPage from "./pages/EmergencyPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import GamificationPage from "./pages/GamificationPage";
import RemindersPage from "./pages/RemindersPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import { PWASettingsPage } from "./pages/PWASettingsPage";
import AppointmentsPageReal from "./pages/AppointmentsPageReal";
import StaffLoginPage from "./pages/StaffLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import { useAnalytics } from "./hooks/useAnalytics";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { useNotificationIntegration } from "./hooks/useNotificationIntegration";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  // Initialize analytics
  useAnalytics();
  
  // Initialize realtime sync
  useRealtimeSync();
  
  // Initialize notifications
  useNotificationIntegration();

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen mobile-scroll">
        <Routes>
          <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
            <Route index element={<Index />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="clinics" element={<ClinicsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="gamification" element={<GamificationPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="accessibility" element={<AccessibilityPage />} />
            <Route path="pwa-settings" element={<PWASettingsPage onNavigate={() => {}} />} />
            <Route path="appointments" element={<AppointmentsPageReal />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
          
          {/* Rotas sem layout principal para staff */}
          <Route path="/staff-login" element={<StaffLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
