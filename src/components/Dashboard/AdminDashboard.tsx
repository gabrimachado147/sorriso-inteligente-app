
import React from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { LazyDashboard } from './LazyDashboard';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, stats }) => {
  // Obter clínica do usuário logado
  const loggedInClinic = sessionStorage.getItem('staffClinic');

  return (
    <LazyDashboard 
      appointments={appointments} 
      stats={stats} 
      loggedInClinic={loggedInClinic}
    />
  );
};
