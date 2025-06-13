
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/Layout/MainLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Index from "@/pages/Index";
import ChatPage from "@/pages/ChatPage";
import SchedulePage from "@/pages/SchedulePage";
import ClinicsPage from "@/pages/ClinicsPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import EmergencyPage from "@/pages/EmergencyPage";
import RemindersPage from "@/pages/RemindersPage";
import AccessibilityPage from "@/pages/AccessibilityPage";
import GamificationPage from "@/pages/GamificationPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import { PWASettingsPage } from "@/pages/PWASettingsPage";

const queryClient = new QueryClient();

// Component to handle page tracking
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/chat') setCurrentPage('chat');
    else if (path === '/appointments') setCurrentPage('appointments');
    else if (path === '/locations') setCurrentPage('locations');
    else if (path === '/profile') setCurrentPage('profile');
    else if (path === '/emergency') setCurrentPage('emergency');
    else if (path === '/reminders') setCurrentPage('reminders');
    else if (path === '/accessibility') setCurrentPage('accessibility');
    else if (path === '/gamification') setCurrentPage('gamification');
    else if (path === '/analytics') setCurrentPage('analytics');
    else if (path === '/pwa-settings') setCurrentPage('pwa-settings');
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout currentPage={currentPage} onPageChange={handlePageChange}>
            <Index />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/chat" element={
        <ProtectedRoute>
          <MainLayout currentPage="chat" onPageChange={handlePageChange}>
            <ChatPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/appointments" element={
        <ProtectedRoute>
          <MainLayout currentPage="appointments" onPageChange={handlePageChange}>
            <SchedulePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/locations" element={
        <ProtectedRoute>
          <MainLayout currentPage="locations" onPageChange={handlePageChange}>
            <ClinicsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout currentPage="profile" onPageChange={handlePageChange}>
            <ProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/emergency" element={
        <ProtectedRoute>
          <MainLayout currentPage="emergency" onPageChange={handlePageChange}>
            <EmergencyPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/reminders" element={
        <ProtectedRoute>
          <MainLayout currentPage="reminders" onPageChange={handlePageChange}>
            <RemindersPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/accessibility" element={
        <ProtectedRoute>
          <MainLayout currentPage="accessibility" onPageChange={handlePageChange}>
            <AccessibilityPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/gamification" element={
        <ProtectedRoute>
          <MainLayout currentPage="gamification" onPageChange={handlePageChange}>
            <GamificationPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute>
          <MainLayout currentPage="analytics" onPageChange={handlePageChange}>
            <AnalyticsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pwa-settings" element={
        <ProtectedRoute>
          <MainLayout currentPage="pwa-settings" onPageChange={handlePageChange}>
            <PWASettingsPage onNavigate={handlePageChange} />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  // Adicionar filtros SVG para daltonismo
  useEffect(() => {
    const svgFilters = `
      <svg class="color-blind-filters">
        <defs>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
          </filter>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = svgFilters;
    document.body.appendChild(div);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
