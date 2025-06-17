
import React, { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useDashboardSelection } from '@/hooks/useDashboardSelection';

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
  loggedInClinic: string;
}

const DashboardContent: React.FC<LazyDashboardProps> = ({ 
  appointments, 
  stats, 
  loggedInClinic 
}) => {
  const { isMaster, clinicName } = useDashboardSelection({ 
    loggedInClinic 
  });

  if (isMaster) {
    return <MasterDashboard appointments={appointments} stats={stats} />;
  }

  return (
    <ClinicDashboard 
      appointments={appointments} 
      stats={stats} 
      clinicName={clinicName} 
    />
  );
};

export const LazyDashboard: React.FC<LazyDashboardProps> = (props) => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent {...props} />
    </Suspense>
  );
};
