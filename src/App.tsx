
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';

// Import pages
import Index from '@/pages/Index';
import SchedulePage from '@/pages/SchedulePage';
import AppointmentsPage from '@/pages/AppointmentsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ChatPage from '@/pages/ChatPage';
import ClinicsPage from '@/pages/ClinicsPage';
import ProfilePage from '@/pages/ProfilePage';
import EmergencyPage from '@/pages/EmergencyPage';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout currentPage="home" onPageChange={() => {}}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agendar" element={<SchedulePage />} />
            <Route path="/agendamentos" element={<AppointmentsPage />} />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/clinicas" element={<ClinicsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/emergencia" element={<EmergencyPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
