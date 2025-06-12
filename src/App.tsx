
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PWASettingsPage from "@/pages/PWASettingsPage";

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          
          <Route path="/pwa-settings" element={
            <ProtectedRoute>
              <MainLayout currentPage="pwa-settings" onPageChange={handlePageChange}>
                <PWASettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
