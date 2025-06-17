
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';

export const useDashboardFilters = (
  appointments: AppointmentRecord[],
  clinicName: string,
  statusFilter: string,
  dateFilter: string,
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
      
      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [clinicAppointments, statusFilter, searchTerm, dateFilter]);

  return { filteredAppointments };
};
