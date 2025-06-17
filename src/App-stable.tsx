
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import LocationsPage from '@/components/Locations/LocationsPage';
import AppointmentScheduler from '@/components/Appointments/AppointmentScheduler';
import ChatPage from '@/pages/ChatPage';
import EmergencyPage from '@/pages/EmergencyPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Simplified HomePage without PWA Dashboard
const SimpleHomePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
            😁
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sorriso Inteligente</h1>
          <p className="text-gray-600 mb-4">
            ✅ Aplicação carregando corretamente em produção!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              🌐 Sistema funcionando
            </span>
            <span className="flex items-center gap-1">
              📱 PWA Ready
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => onNavigate('appointments')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-semibold text-gray-900">Agendamentos</h3>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('chat')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900">Chat IA</h3>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('locations')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-900">Localização</h3>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('emergency')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="font-semibold text-gray-900">Emergência</h3>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button 
            onClick={() => onNavigate('appointments')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Agendar Consulta
          </button>
          <button 
            onClick={() => onNavigate('chat')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Chat com IA
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Recarregar
          </button>
        </div>

        {/* Status Footer */}
        <div className="text-center space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              🟢 Status: Online
            </span>
            <span className="flex items-center gap-1">
              📱 Plataforma: Web & PWA
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              ⚡ Performance: Otimizada
            </span>
            <span className="flex items-center gap-1">
              🔒 Segurança: HTTPS
            </span>
          </div>
          <p className="text-xs mt-4">Versão 3.0 - Atualizado em 11/06/2025</p>
        </div>
      </div>
    </div>
  );
};

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
        <MainLayout>
          <Routes>
            <Route path="/" element={<SimpleHomePage onNavigate={handleNavigate} />} />
            <Route path="/home" element={<SimpleHomePage onNavigate={handleNavigate} />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/clinics" element={<LocationsPage />} />
            <Route path="/appointments" element={<AppointmentScheduler />} />
            <Route path="/schedule" element={<AppointmentScheduler />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
