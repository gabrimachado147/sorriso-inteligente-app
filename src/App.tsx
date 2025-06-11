import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { HomePage } from '@/components/Dashboard/HomePage';
import LocationsPage from '@/components/Locations/LocationsPage';
import AppointmentScheduler from '@/components/Appointments/AppointmentScheduler';
import ChatPage from '@/pages/ChatPage';
import EmergencyPage from '@/pages/EmergencyPage';
import ProfilePage from '@/pages/ProfilePage';
import { PWASettingsPage } from '@/pages/PWASettingsPage';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import { Toaster } from '@/components/ui/toaster';
import { PWANotification } from '@/components/PWA/PWANotification';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="App">
        <MainLayout currentPage={currentPage} onPageChange={handlePageChange}>
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/index" element={<Index />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/clinics" element={<LocationsPage />} />
            <Route path="/appointments" element={<AppointmentScheduler />} />
            <Route path="/schedule" element={<AppointmentScheduler />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/pwa-settings" element={<PWASettingsPage onNavigate={handleNavigate} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        
        {/* PWA Notifications - sempre visível */}
        <PWANotification />
        
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
