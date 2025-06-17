
import React, { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { AppointmentRecord } from '@/services/supabase/appointments';

// Lazy loading dos componentes pesados
const ClinicDashboard = React.lazy(() => 
  import('./ClinicDashboard').then(module => ({ default: module.ClinicDashboard }))
);

const MasterDashboard = React.lazy(() => 
  import('./MasterDashboard').then(module => ({ default: module.MasterDashboard }))
);

interface LazyDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
  loggedInClinic: string | null;
}

export const LazyDashboard: React.FC<LazyDashboardProps> = ({ 
  appointments, 
  stats, 
  loggedInClinic 
}) => {
  const isMaster = loggedInClinic === 'gerencia-ss';

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {isMaster ? (
        <MasterDashboard appointments={appointments} stats={stats} />
      ) : (
        <ClinicDashboard 
          appointments={appointments} 
          stats={stats} 
          clinicName={loggedInClinic || ''} 
        />
      )}
    </Suspense>
  );
};
