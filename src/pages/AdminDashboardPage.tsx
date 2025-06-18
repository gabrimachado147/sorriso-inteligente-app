
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { PageHead } from '@/components/SEO/PageHead';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, Sparkles } from 'lucide-react';
import { animations } from '@/lib/animations';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    if (window.history.length > 1 && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/admin-dashboard');
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHead
          title="Dashboard Administrativo - Sorriso Inteligente"
          description="Painel administrativo para gestão de agendamentos e operações da rede Sorriso Inteligente."
          keywords="dashboard administrativo, gestão agendamentos, painel admin, operações, Sorriso Inteligente"
          url="https://senhorsorrisso.com.br/admin-dashboard"
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <Sparkles className="h-6 w-6 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Preparando seu Sorriso Inteligente...
            </h2>
            <p className="text-gray-600">Carregando dashboard com carinho ✨</p>
          </div>
        </div>
      </>
    );
  }

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  return (
    <>
      <PageHead
        title="Dashboard Administrativo - Sorriso Inteligente"
        description="Painel administrativo para gestão de agendamentos e operações da rede Sorriso Inteligente."
        keywords="dashboard administrativo, gestão agendamentos, painel admin, operações, Sorriso Inteligente"
        url="https://senhorsorrisso.com.br/admin-dashboard"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Melhorado */}
        <div className="bg-white shadow-lg border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGoBack} 
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Sorriso Inteligente
                  </h1>
                  <p className="text-sm text-gray-600">
                    Dashboard • {staffClinic.charAt(0).toUpperCase() + staffClinic.slice(1)}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair com Segurança
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className={`${animations.pageEnter}`}>
            <AdminDashboard appointments={appointments} stats={stats} />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;
