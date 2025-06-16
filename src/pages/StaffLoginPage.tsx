
import React from 'react';
import { StaffLogin } from '@/components/Auth/StaffLogin';
import { useNavigate } from 'react-router-dom';

const StaffLoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (clinicUsername: string) => {
    // Armazenar informação do funcionário logado
    sessionStorage.setItem('staffClinic', clinicUsername);
    sessionStorage.setItem('isStaffLoggedIn', 'true');
    
    // Redirecionar para o dashboard
    navigate('/admin-dashboard');
  };

  return <StaffLogin onLogin={handleLogin} />;
};

export default StaffLoginPage;
