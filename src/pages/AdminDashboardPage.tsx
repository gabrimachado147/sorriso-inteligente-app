
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Dashboard Administrativo</h1>
              <p className="text-sm text-muted-foreground">
                Clínica: {staffClinic.charAt(0).toUpperCase() + staffClinic.slice(1)}
              </p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdminDashboard appointments={appointments} stats={stats} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
