
import React from 'react';
import { StaffLogin } from '@/components/Auth/StaffLogin';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className={`min-h-screen bg-background ${animations.pageEnter}`}>
      <div className="mobile-container px-4 py-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-auto mobile-card-spacing">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold">Login da Equipe</h1>
              <p className="text-muted-foreground mt-2">
                Acesse o painel administrativo
              </p>
            </div>
            <StaffLogin onLogin={handleLogin} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffLoginPage;
