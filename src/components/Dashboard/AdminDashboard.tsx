
import React from 'react';
import { ClinicDashboard } from './ClinicDashboard';
import { MasterDashboard } from './MasterDashboard';

export const AdminDashboard = () => {
  // Obter informações do usuário logado
  const loggedInUser = sessionStorage.getItem('staffClinic');
  const isMasterUser = loggedInUser === 'gerencia-ss';
  
  // Mapeamento de clínicas
  const CLINIC_NAMES: Record<string, string> = {
    'capao-bonito': 'Senhor Sorriso Capão Bonito',
    'campo-belo': 'Senhor Sorriso Campo Belo',
    'itapeva': 'Senhor Sorriso Itapeva',
    'itarare': 'Senhor Sorriso Itararé',
    'formiga': 'Senhor Sorriso Formiga'
  };

  const userClinicName = loggedInUser && !isMasterUser ? CLINIC_NAMES[loggedInUser] : '';

  const userInfo = {
    isMasterUser,
    clinicName: userClinicName
  };

  // Renderizar dashboard apropriado baseado no nível de acesso
  if (isMasterUser) {
    return <MasterDashboard userInfo={userInfo} />;
  } else {
    return <ClinicDashboard userInfo={userInfo} />;
  }
};
