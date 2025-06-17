
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { InstitutionalLayout } from "@/components/Institutional/InstitutionalLayout";
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
import InstitutionalHome from "./pages/InstitutionalHome";
import ServicesPage from "./components/Institutional/ServicesPage";
import { LocationsPage } from "./components/Institutional/LocationsPage";
import AboutPage from "./components/Institutional/AboutPage";
import ContactPage from "./components/Institutional/ContactPage";
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
      <div className="w-full min-h-screen">
        <Routes>
          {/* Institutional Website Routes */}
          <Route path="/institutional" element={<InstitutionalLayout><Outlet /></InstitutionalLayout>}>
            <Route index element={<InstitutionalHome />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* App Routes */}
          <Route path="/app" element={<MainLayout><Outlet /></MainLayout>}>
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
          </Route>
          
          {/* Default route redirects to institutional */}
          <Route path="/" element={<Navigate to="/institutional" replace />} />
          
          {/* Legacy app routes (redirect to /app) */}
          <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
          <Route path="/schedule" element={<Navigate to="/app/schedule" replace />} />
          <Route path="/clinics" element={<Navigate to="/app/clinics" replace />} />
          <Route path="/emergency" element={<Navigate to="/app/emergency" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          
          {/* Staff routes without layout */}
          <Route path="/staff-login" element={<StaffLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          
          {/* 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
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
