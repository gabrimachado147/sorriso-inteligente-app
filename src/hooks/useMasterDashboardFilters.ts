
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface UseMasterDashboardFiltersParams {
  filteredAppointments: AppointmentRecord[];
  periodFilter: string;
}

export const useMasterDashboardFilters = ({ 
  filteredAppointments, 
  periodFilter 
}: UseMasterDashboardFiltersParams) => {
  return useMemo(() => {
    if (periodFilter === 'all') return filteredAppointments;
    
    const today = new Date();
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      
      switch (periodFilter) {
        case 'today':
          return aptDate.toDateString() === today.toDateString();
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return aptDate.toDateString() === yesterday.toDateString();
        }
        case 'week': {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return aptDate >= startOfWeek;
        }
        case 'last_week': {
          const startOfLastWeek = new Date(today);
          startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
          const endOfLastWeek = new Date(startOfLastWeek);
          endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
          return aptDate >= startOfLastWeek && aptDate <= endOfLastWeek;
        }
        case 'month': {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return aptDate >= startOfMonth;
        }
        case 'last_month': {
          const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          return aptDate >= startOfLastMonth && aptDate <= endOfLastMonth;
        }
        case 'quarter': {
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const startOfQuarter = new Date(today.getFullYear(), currentQuarter * 3, 1);
          return aptDate >= startOfQuarter;
        }
        case 'last_quarter': {
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
          const yearForLastQuarter = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
          const startOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3, 1);
          const endOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3 + 3, 0);
          return aptDate >= startOfLastQuarter && aptDate <= endOfLastQuarter;
        }
        case 'year': {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return aptDate >= startOfYear;
        }
        case 'last_year': {
          const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
          const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
          return aptDate >= startOfLastYear && aptDate <= endOfLastYear;
        }
        default:
          return true;
      }
    });
  }, [filteredAppointments, periodFilter]);
};
