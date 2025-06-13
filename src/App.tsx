
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
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
import PWASettingsPage from "./pages/PWASettingsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
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
              <Route path="pwa-settings" element={<PWASettingsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
