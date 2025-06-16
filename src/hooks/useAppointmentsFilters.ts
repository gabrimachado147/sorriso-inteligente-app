
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

    console.log('[useAppointmentsFilters] Starting with appointments:', filtered.length);

    // Aplicar filtro de clínica baseado no nível de acesso
    if (!isMasterUser && loggedInUser && userClinicName) {
      // Usuário de unidade específica - mostrar apenas agendamentos da sua clínica
      console.log('[useAppointmentsFilters] Filtering for clinic user:', userClinicName);
      
      // Mapear as chaves de login para os nomes das clínicas nos agendamentos
      const clinicKeyToNameMap: Record<string, string[]> = {
        'capao-bonito': ['Senhor Sorriso Capão Bonito', 'capao bonito', 'capão bonito'],
        'campo-belo': ['Senhor Sorriso Campo Belo', 'campo belo'],
        'itapeva': ['Senhor Sorriso Itapeva', 'itapeva'],
        'itarare': ['Senhor Sorriso Itararé', 'itarare', 'itararé'],
        'formiga': ['Senhor Sorriso Formiga', 'formiga']
      };

      const allowedClinicNames = clinicKeyToNameMap[loggedInUser] || [];
      
      filtered = filtered.filter(apt => {
        const appointmentClinic = apt.clinic.toLowerCase().trim();
        const matches = allowedClinicNames.some(clinicName => 
          appointmentClinic.includes(clinicName.toLowerCase()) ||
          clinicName.toLowerCase().includes(appointmentClinic)
        );
        
        console.log('[useAppointmentsFilters] Checking appointment:', {
          appointmentClinic: apt.clinic,
          loggedInUser,
          allowedClinicNames,
          matches
        });
        
        return matches;
      });
      
      console.log('[useAppointmentsFilters] After clinic filter:', filtered.length);
    } else if (isMasterUser) {
      // Usuário master (gerência) - ver todos os agendamentos
      console.log('[useAppointmentsFilters] Master user - showing all appointments');
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
      const clinicKeyToNameMap: Record<string, string[]> = {
        'capao-bonito': ['Senhor Sorriso Capão Bonito'],
        'campo-belo': ['Senhor Sorriso Campo Belo'],
        'itapeva': ['Senhor Sorriso Itapeva'],
        'itarare': ['Senhor Sorriso Itararé'],
        'formiga': ['Senhor Sorriso Formiga']
      };

      const allowedClinicNames = clinicKeyToNameMap[loggedInUser] || [];
      
      const userAppointments = appointments.filter(apt => {
        const appointmentClinic = apt.clinic.toLowerCase().trim();
        return allowedClinicNames.some(clinicName => 
          appointmentClinic.includes(clinicName.toLowerCase()) ||
          clinicName.toLowerCase().includes(appointmentClinic)
        );
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
