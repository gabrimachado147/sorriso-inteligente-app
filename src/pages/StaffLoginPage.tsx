
import React from 'react';
import { StaffLogin } from '@/components/Auth/StaffLogin';
import { useNavigate } from 'react-router-dom';
import { animations } from '@/lib/animations';

const StaffLoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (clinicUsername: string) => {
    // Armazenar informação do funcionário logado
    sessionStorage.setItem('staffClinic', clinicUsername);
    sessionStorage.setItem('isStaffLoggedIn', 'true');
    
    // Redirecionar para o dashboard
    navigate('/admin-dashboard');
  };

  return (
    <div className={`min-h-screen bg-background overflow-x-hidden ${animations.pageEnter}`}>
      <div className="mobile-container px-4 py-6 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold">Login da Equipe</h1>
            <p className="text-muted-foreground mt-2">
              Acesse o painel administrativo
            </p>
          </div>
          <StaffLogin onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
