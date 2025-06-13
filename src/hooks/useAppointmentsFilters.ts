
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

  const userClinicName = loggedInUser ? CLINIC_NAMES[loggedInUser as keyof typeof CLINIC_NAMES] : '';

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by user's clinic first (only show appointments for their clinic)
    if (loggedInUser && userClinicName) {
      filtered = filtered.filter(apt => {
        // Check if appointment clinic matches the user's clinic
        const appointmentClinic = apt.clinic.toLowerCase();
        const userClinicKey = loggedInUser.toLowerCase();
        const userClinicFullName = userClinicName.toLowerCase();
        
        // Match by clinic key (e.g., "campobelo") or full clinic name
        return appointmentClinic.includes(userClinicKey) || 
               appointmentClinic.includes(userClinicFullName) ||
               apt.clinic === userClinicName;
      });
    }

    // Apply additional filters
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

    return filtered;
  }, [appointments, loggedInUser, userClinicName, searchTerm, selectedClinic, selectedStatus, selectedDate]);

  // Get unique clinics from filtered appointments for filter (only show user's clinic)
  const availableClinics = useMemo(() => {
    if (loggedInUser && userClinicName) {
      // Only show the user's clinic in the filter
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
    
    const clinics = new Set(appointments.map(apt => apt.clinic));
    return Array.from(clinics).sort();
  }, [appointments, loggedInUser, userClinicName]);

  return {
    filteredAppointments,
    availableClinics,
    userClinicName
  };
};
