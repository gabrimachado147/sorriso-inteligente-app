
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { CLINIC_OPTIONS } from '@/components/Auth/StaffLogin';

interface UseAppointmentsFiltersProps {
  appointments: AppointmentRecord[];
  loggedInUser: string | null;
  searchTerm: string;
  selectedClinic: string;
  selectedStatus: string;
  selectedDate: string;
}

export const useAppointmentsFilters = ({
  appointments,
  loggedInUser,
  searchTerm,
  selectedClinic,
  selectedStatus,
  selectedDate
}: UseAppointmentsFiltersProps) => {
  // Converter CLINIC_OPTIONS array para objeto para compatibilidade
  const CLINIC_NAMES = useMemo(() => {
    return CLINIC_OPTIONS.reduce((acc, clinic) => {
      acc[clinic.value] = clinic.label;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // Verificar se é o login master (gerência)
  const isMasterUser = loggedInUser === 'gerencia-ss';
  const userClinicName = loggedInUser && !isMasterUser ? CLINIC_NAMES[loggedInUser as keyof typeof CLINIC_NAMES] : '';

  console.log('[useAppointmentsFilters] User info:', { 
    loggedInUser, 
    isMasterUser, 
    userClinicName 
  });

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Aplicar filtro de clínica baseado no nível de acesso
    if (!isMasterUser && loggedInUser && userClinicName) {
      // Usuário de unidade específica - mostrar apenas agendamentos da sua clínica
      console.log('[useAppointmentsFilters] Filtering for clinic user:', userClinicName);
      filtered = filtered.filter(apt => {
        const appointmentClinic = apt.clinic.toLowerCase();
        const userClinicKey = loggedInUser.toLowerCase();
        const userClinicFullName = userClinicName.toLowerCase();
        
        // Match por chave da clínica (ex: "campobelo") ou nome completo da clínica
        const matches = appointmentClinic.includes(userClinicKey) || 
                       appointmentClinic.includes(userClinicFullName) ||
                       apt.clinic === userClinicName;
        
        console.log('[useAppointmentsFilters] Appointment clinic check:', {
          appointmentClinic,
          userClinicKey,
          userClinicFullName,
          matches
        });
        
        return matches;
      });
    } else if (isMasterUser) {
      // Usuário master (gerência) - ver todos os agendamentos
      console.log('[useAppointmentsFilters] Master user - showing all appointments');
      // Não aplicar filtro de clínica, mostrar todos
    }

    // Aplicar outros filtros
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.name.toLowerCase().includes(search) ||
        apt.phone.includes(search) ||
        apt.email?.toLowerCase().includes(search) ||
        apt.service.toLowerCase().includes(search)
      );
    }

    if (selectedClinic !== 'all') {
      filtered = filtered.filter(apt => apt.clinic === selectedClinic);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter(apt => apt.date === selectedDate);
    }

    console.log('[useAppointmentsFilters] Final filtered count:', filtered.length);
    return filtered;
  }, [appointments, loggedInUser, isMasterUser, userClinicName, searchTerm, selectedClinic, selectedStatus, selectedDate]);

  // Obter clínicas disponíveis baseado no nível de acesso
  const availableClinics = useMemo(() => {
    if (isMasterUser) {
      // Usuário master - mostrar todas as clínicas disponíveis
      const clinics = new Set(appointments.map(apt => apt.clinic));
      return Array.from(clinics).sort();
    } else if (loggedInUser && userClinicName) {
      // Usuário de unidade específica - mostrar apenas sua clínica
      const userAppointments = appointments.filter(apt => {
        const appointmentClinic = apt.clinic.toLowerCase();
        const userClinicKey = loggedInUser.toLowerCase();
        const userClinicFullName = userClinicName.toLowerCase();
        
        return appointmentClinic.includes(userClinicKey) || 
               appointmentClinic.includes(userClinicFullName) ||
               apt.clinic === userClinicName;
      });
      
      const clinics = new Set(userAppointments.map(apt => apt.clinic));
      return Array.from(clinics).sort();
    }
    
    // Fallback
    const clinics = new Set(appointments.map(apt => apt.clinic));
    return Array.from(clinics).sort();
  }, [appointments, loggedInUser, isMasterUser, userClinicName]);

  return {
    filteredAppointments,
    availableClinics,
    userClinicName,
    isMasterUser
  };
};
