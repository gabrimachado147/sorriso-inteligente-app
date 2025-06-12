
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import Index from "./pages/Index";
import SchedulePage from "./pages/SchedulePage";
import ClinicsPage from "./pages/ClinicsPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import EmergencyPage from "./pages/EmergencyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = (path: string) => {
    switch (path) {
      case '/': return 'home';
      case '/schedule': return 'appointments';
      case '/clinics': return 'locations';
      case '/chat': return 'chat';
      case '/profile': return 'profile';
      case '/emergency': return 'emergency';
      default: return 'home';
    }
  };

  const handlePageChange = (page: string) => {
    const routes = {
      'home': '/',
      'appointments': '/schedule',
      'locations': '/clinics',
      'chat': '/chat',
      'profile': '/profile',
      'emergency': '/emergency'
    };
    navigate(routes[page as keyof typeof routes] || '/');
  };

  const currentPage = getPageFromPath(location.pathname);

  return (
    <MainLayout currentPage={currentPage} onPageChange={handlePageChange}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/clinics" element={<ClinicsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
