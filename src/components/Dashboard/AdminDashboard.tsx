
import React from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { LazyDashboard } from './LazyDashboard';
import { useDashboardSelection } from '@/hooks/useDashboardSelection';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  appointments, 
  stats 
}) => {
  const loggedInClinic = sessionStorage.getItem('staffClinic');
  
  const { isLoading, clinicName } = useDashboardSelection({ 
    loggedInClinic 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <LazyDashboard 
      appointments={appointments} 
      stats={stats} 
      loggedInClinic={clinicName}
    />
  );
};
