
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';

export const useDashboardFilters = (
  appointments: AppointmentRecord[],
  clinicName: string,
  statusFilter: string,
  dateFilter: string,
  periodFilter: string,
  searchTerm: string
) => {
  // Filtrar apenas agendamentos da clínica específica
  const clinicAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const appointmentClinic = apt.clinic.toLowerCase();
      const userClinic = clinicName.toLowerCase();
      
      return appointmentClinic.includes(userClinic) || 
             apt.clinic === clinicName;
    });
  }, [appointments, clinicName]);

  // Aplicar filtros adicionais
  const filteredAppointments = useMemo(() => {
    return clinicAppointments.filter(apt => {
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const matchesSearch = !searchTerm || 
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone.includes(searchTerm) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const today = new Date();
        const aptDate = new Date(apt.date);
        
        switch (dateFilter) {
          case 'today': {
            matchesDate = aptDate.toDateString() === today.toDateString();
            break;
          }
          case 'week': {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = aptDate >= weekAgo;
            break;
          }
          case 'month': {
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = aptDate >= monthAgo;
            break;
          }
        }
      }

      // Novo filtro de período
      let matchesPeriod = true;
      if (periodFilter !== 'all') {
        const today = new Date();
        const aptDate = new Date(apt.date);
        
        switch (periodFilter) {
          case 'today': {
            matchesPeriod = aptDate.toDateString() === today.toDateString();
            break;
          }
          case 'yesterday': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesPeriod = aptDate.toDateString() === yesterday.toDateString();
            break;
          }
          case 'week': {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            matchesPeriod = aptDate >= startOfWeek;
            break;
          }
          case 'last_week': {
            const startOfLastWeek = new Date(today);
            startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
            matchesPeriod = aptDate >= startOfLastWeek && aptDate <= endOfLastWeek;
            break;
          }
          case 'month': {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            matchesPeriod = aptDate >= startOfMonth;
            break;
          }
          case 'last_month': {
            const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            matchesPeriod = aptDate >= startOfLastMonth && aptDate <= endOfLastMonth;
            break;
          }
          case 'quarter': {
            const currentQuarter = Math.floor(today.getMonth() / 3);
            const startOfQuarter = new Date(today.getFullYear(), currentQuarter * 3, 1);
            matchesPeriod = aptDate >= startOfQuarter;
            break;
          }
          case 'last_quarter': {
            const currentQuarter = Math.floor(today.getMonth() / 3);
            const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
            const yearForLastQuarter = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
            const startOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3, 1);
            const endOfLastQuarter = new Date(yearForLastQuarter, lastQuarter * 3 + 3, 0);
            matchesPeriod = aptDate >= startOfLastQuarter && aptDate <= endOfLastQuarter;
            break;
          }
          case 'year': {
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            matchesPeriod = aptDate >= startOfYear;
            break;
          }
          case 'last_year': {
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
            matchesPeriod = aptDate >= startOfLastYear && aptDate <= endOfLastYear;
            break;
          }
        }
      }
      
      return matchesStatus && matchesSearch && matchesDate && matchesPeriod;
    });
  }, [clinicAppointments, statusFilter, searchTerm, dateFilter, periodFilter]);

  return { filteredAppointments };
};
