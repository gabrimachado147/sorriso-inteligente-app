
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PatientData, AppointmentData } from '@/services/supabase/optimizedQueries';
import { OptimizedSupabaseService } from '@/services/supabase/optimizedQueries';

interface AppStore {
  // Patients state
  patients: PatientData[];
  patientsLoading: boolean;
  patientsError: string | null;
  
  // Appointments state
  appointments: AppointmentData[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
  appointmentsPagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  
  // Filters
  filters: {
    clinic: string;
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  
  // Statistics
  stats: {
    totalPatients: number;
    newPatientsThisMonth: number;
    activeAppointments: number;
  };

  // Actions
  fetchPatients: () => Promise<void>;
  searchPatients: (term: string) => Promise<void>;
  fetchAppointments: (options?: { page?: number; reset?: boolean }) => Promise<void>;
  setFilters: (filters: Partial<AppStore['filters']>) => void;
  fetchStats: () => Promise<void>;
  addPatient: (patient: PatientData) => void;
  updatePatient: (id: string, patient: Partial<PatientData>) => void;
  addAppointment: (appointment: AppointmentData) => void;
  updateAppointment: (id: string, appointment: Partial<AppointmentData>) => void;
  removeAppointment: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      patients: [],
      patientsLoading: false,
      patientsError: null,
      
      appointments: [],
      appointmentsLoading: false,
      appointmentsError: null,
      appointmentsPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      
      filters: {
        clinic: '',
        status: '',
        dateRange: {
          start: '',
          end: '',
        },
      },
      
      stats: {
        totalPatients: 0,
        newPatientsThisMonth: 0,
        activeAppointments: 0,
      },

      // Actions
      fetchPatients: async () => {
        set({ patientsLoading: true, patientsError: null });
        try {
          const patients = await OptimizedSupabaseService.getPatients();
          set({ patients, patientsLoading: false });
        } catch (error) {
          set({ 
            patientsError: error instanceof Error ? error.message : 'Error fetching patients',
            patientsLoading: false 
          });
        }
      },

      searchPatients: async (term: string) => {
        set({ patientsLoading: true, patientsError: null });
        try {
          const patients = await OptimizedSupabaseService.searchPatients(term);
          set({ patients, patientsLoading: false });
        } catch (error) {
          set({ 
            patientsError: error instanceof Error ? error.message : 'Error searching patients',
            patientsLoading: false 
          });
        }
      },

      fetchAppointments: async (options: { page?: number; reset?: boolean } = {}) => {
        const { page = 1, reset = false } = options;
        const { filters, appointmentsPagination } = get();
        
        set({ appointmentsLoading: true, appointmentsError: null });
        
        try {
          const result = await OptimizedSupabaseService.getAppointments({
            page,
            pageSize: appointmentsPagination.pageSize,
            clinic: filters.clinic || undefined,
            status: filters.status || undefined,
          });
          
          set({ 
            appointments: reset ? result.data : [...get().appointments, ...result.data],
            appointmentsPagination: {
              ...appointmentsPagination,
              page,
              total: result.count,
            },
            appointmentsLoading: false 
          });
        } catch (error) {
          set({ 
            appointmentsError: error instanceof Error ? error.message : 'Error fetching appointments',
            appointmentsLoading: false 
          });
        }
      },

      setFilters: (newFilters: Partial<AppStore['filters']>) => {
        set({ 
          filters: { ...get().filters, ...newFilters }
        });
        // Auto-refresh appointments when filters change
        get().fetchAppointments({ page: 1, reset: true });
      },

      fetchStats: async () => {
        try {
          const stats = await OptimizedSupabaseService.getPatientStats();
          set({ stats });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      },

      addPatient: (patient: PatientData) => {
        set({ patients: [patient, ...get().patients] });
      },

      updatePatient: (id: string, updatedData: Partial<PatientData>) => {
        set({
          patients: get().patients.map(patient =>
            patient.id === id ? { ...patient, ...updatedData } : patient
          )
        });
      },

      addAppointment: (appointment: AppointmentData) => {
        set({ appointments: [appointment, ...get().appointments] });
      },

      updateAppointment: (id: string, updatedData: Partial<AppointmentData>) => {
        set({
          appointments: get().appointments.map(appointment =>
            appointment.id === id ? { ...appointment, ...updatedData } : appointment
          )
        });
      },

      removeAppointment: (id: string) => {
        set({
          appointments: get().appointments.filter(appointment => appointment.id !== id)
        });
      },
    }),
    {
      name: 'app-store',
    }
  )
);
