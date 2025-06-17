
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import InstitutionalLayout from "@/components/Institutional/InstitutionalLayout";

// Main PWA App Pages
import Index from "./pages/Index";
import SchedulePage from "./pages/SchedulePage";
import ClinicsPage from "./pages/ClinicsPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import StaffLoginPage from "./pages/StaffLoginPage";
import AppointmentDetailsPage from "./pages/AppointmentDetailsPage";

// Institutional Website Pages
import InstitutionalHome from "./pages/InstitutionalHome";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./components/Institutional/ServicesPage";
import LocationsPage from "./components/Institutional/LocationsPage";
import ContactPage from "./components/Institutional/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main PWA App Routes */}
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/schedule" element={<MainLayout><SchedulePage /></MainLayout>} />
          <Route path="/clinics" element={<MainLayout><ClinicsPage /></MainLayout>} />
          <Route path="/chat" element={<MainLayout><ChatPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/staff-login" element={<MainLayout><StaffLoginPage /></MainLayout>} />
          <Route path="/appointment/:id" element={<MainLayout><AppointmentDetailsPage /></MainLayout>} />
          
          {/* Institutional Website Routes */}
          <Route path="/site" element={<InstitutionalLayout><InstitutionalHome /></InstitutionalLayout>} />
          <Route path="/site/about" element={<InstitutionalLayout><AboutPage /></InstitutionalLayout>} />
          <Route path="/site/services" element={<InstitutionalLayout><ServicesPage /></InstitutionalLayout>} />
          <Route path="/site/locations" element={<InstitutionalLayout><LocationsPage /></InstitutionalLayout>} />
          <Route path="/site/contact" element={<InstitutionalLayout><ContactPage /></InstitutionalLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
