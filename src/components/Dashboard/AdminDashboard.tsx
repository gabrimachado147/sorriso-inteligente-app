
import React from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { ClinicDashboard } from './ClinicDashboard';
import { MasterDashboard } from './MasterDashboard';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, stats }) => {
  // Obter clínica do usuário logado
  const loggedInClinic = sessionStorage.getItem('staffClinic');

  // Se for gerência, mostrar dashboard master, senão mostrar dashboard da clínica
  if (loggedInClinic === 'gerencia-ss') {
    return <MasterDashboard appointments={appointments} stats={stats} />;
  }

  return <ClinicDashboard appointments={appointments} stats={stats} clinicName={loggedInClinic || ''} />;
};
