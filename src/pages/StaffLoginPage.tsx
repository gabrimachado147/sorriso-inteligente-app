
import React from 'react';
import { StaffLogin } from '@/components/Auth/StaffLogin';
import { useNavigate } from 'react-router-dom';

const StaffLoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (clinicUsername: string) => {
    console.log('[StaffLoginPage] Login successful for:', clinicUsername);
    
    // Armazenar informação do funcionário logado
    sessionStorage.setItem('staffClinic', clinicUsername);
    sessionStorage.setItem('isStaffLoggedIn', 'true');
    
    // Verificar se é usuário master
    const isMasterUser = clinicUsername === 'gerencia-ss';
    if (isMasterUser) {
      sessionStorage.setItem('isMasterUser', 'true');
      console.log('[StaffLoginPage] Master user logged in');
    } else {
      sessionStorage.setItem('isMasterUser', 'false');
      console.log('[StaffLoginPage] Clinic user logged in:', clinicUsername);
    }
    
    // Redirecionar para o dashboard
    navigate('/admin-dashboard');
  };

  return <StaffLogin onLogin={handleLogin} />;
};

export default StaffLoginPage;
