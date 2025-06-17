
import React, { lazy, Suspense } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useDashboardSelection } from '@/hooks/useDashboardSelection';

// Lazy load dashboard components
const ClinicDashboard = lazy(() => 
  import('./ClinicDashboard').then(module => ({ default: module.ClinicDashboard }))
);
const MasterDashboard = lazy(() => 
  import('./MasterDashboard').then(module => ({ default: module.MasterDashboard }))
);

interface LazyDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
  loggedInClinic: string;
}

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
    <div className="h-96 bg-gray-200 rounded-lg"></div>
  </div>
);

export const LazyDashboard: React.FC<LazyDashboardProps> = ({
  appointments,
  stats,
  loggedInClinic
}) => {
  const { isMaster, isClinic, dashboardType } = useDashboardSelection({ 
    loggedInClinic 
  });

  console.log('LazyDashboard props:', { 
    appointmentsCount: appointments.length, 
    stats, 
    loggedInClinic, 
    dashboardType 
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {isMaster && (
        <MasterDashboard 
          appointments={appointments} 
          stats={stats} 
        />
      )}
      {isClinic && (
        <ClinicDashboard 
          appointments={appointments} 
          stats={stats} 
          clinicName={loggedInClinic}
        />
      )}
    </Suspense>
  );
};
