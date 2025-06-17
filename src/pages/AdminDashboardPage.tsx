
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { animations } from '@/lib/animations';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [staffClinic, setStaffClinic] = useState<string>('');
  const { appointments, isLoading } = useAppointments();

  useEffect(() => {
    const isStaffLoggedIn = sessionStorage.getItem('isStaffLoggedIn');
    const clinic = sessionStorage.getItem('staffClinic');
    
    if (!isStaffLoggedIn || !clinic) {
      navigate('/staff-login');
      return;
    }
    
    setStaffClinic(clinic);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('staffClinic');
    sessionStorage.removeItem('isStaffLoggedIn');
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center overflow-x-hidden">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="mobile-text-base">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Calcular estatísticas básicas
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mobile-container px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoBack} 
                className="mobile-touch-target flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <div className="min-w-0 flex-1 text-center">
                <h1 className="text-lg font-semibold mobile-text-lg truncate">
                  Dashboard Admin
                </h1>
                <p className="text-sm text-muted-foreground mobile-text-sm truncate">
                  {staffClinic.charAt(0).toUpperCase() + staffClinic.slice(1)}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="mobile-touch-target flex-shrink-0"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="flex-1 w-full mobile-scroll overflow-x-hidden">
        <div className="mobile-container px-4 py-6">
          <div className={`space-y-6 ${animations.pageEnter} overflow-x-hidden`}>
            <AdminDashboard appointments={appointments} stats={stats} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
