
import { useMemo } from 'react';

interface UseDashboardSelectionProps {
  loggedInClinic: string | null;
}

export const useDashboardSelection = ({ loggedInClinic }: UseDashboardSelectionProps) => {
  const dashboardType = useMemo(() => {
    if (!loggedInClinic) return 'loading';
    return loggedInClinic === 'gerencia-ss' ? 'master' : 'clinic';
  }, [loggedInClinic]);

  const isMaster = dashboardType === 'master';
  const isClinic = dashboardType === 'clinic';
  const isLoading = dashboardType === 'loading';

  return {
    dashboardType,
    isMaster,
    isClinic,
    isLoading,
    clinicName: loggedInClinic || ''
  };
};
