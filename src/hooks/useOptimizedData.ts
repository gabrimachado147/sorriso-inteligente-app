
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OptimizedSupabaseService } from '@/services/supabase/optimizedQueries';
import { RealtimeService } from '@/services/supabase/realtimeService';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

// Optimized patients hook with caching
export const useOptimizedPatients = (searchTerm?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      if (searchTerm) {
        return OptimizedSupabaseService.searchPatients(searchTerm);
      }
      return OptimizedSupabaseService.getPatients(['id', 'full_name', 'phone', 'email', 'created_at']);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Setup realtime subscriptions
  useEffect(() => {
    const unsubscribe = RealtimeService.subscribeToPatients({
      onInsert: (payload) => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
      },
      onUpdate: (payload) => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
      },
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};

// Optimized appointments hook with pagination
export const useOptimizedAppointments = (options: {
  page?: number;
  clinic?: string;
  status?: string;
  enabled?: boolean;
} = {}) => {
  const { page = 1, clinic, status, enabled = true } = options;
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['appointments', page, clinic, status],
    queryFn: () => OptimizedSupabaseService.getAppointments({
      page,
      pageSize: 20,
      clinic,
      status,
      fields: ['id', 'name', 'phone', 'date', 'time', 'clinic', 'service', 'status', 'created_at']
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });

  // Setup realtime subscriptions
  useEffect(() => {
    const unsubscribe = RealtimeService.subscribeToAppointments({
      onInsert: (payload) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      },
      onUpdate: (payload) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      },
      onDelete: (payload) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      },
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};

// Statistics hook with caching
export const usePatientStats = () => {
  return useQuery({
    queryKey: ['patient-stats'],
    queryFn: OptimizedSupabaseService.getPatientStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Appointments by date range hook
export const useAppointmentsByDateRange = (
  startDate?: string,
  endDate?: string,
  clinic?: string
) => {
  return useQuery({
    queryKey: ['appointments-date-range', startDate, endDate, clinic],
    queryFn: () => OptimizedSupabaseService.getAppointmentsByDateRange(
      startDate!,
      endDate!,
      clinic
    ),
    enabled: !!startDate && !!endDate,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Realtime notifications hook
export const useRealtimeNotifications = () => {
  const { addAppointment, updateAppointment, removeAppointment } = useAppStore();

  useEffect(() => {
    const unsubscribeAppointments = RealtimeService.subscribeToAppointments({
      onInsert: (payload) => {
        if (payload.new) {
          addAppointment(payload.new);
        }
      },
      onUpdate: (payload) => {
        if (payload.new) {
          updateAppointment(payload.new.id, payload.new);
        }
      },
      onDelete: (payload) => {
        if (payload.old) {
          removeAppointment(payload.old.id);
        }
      },
    });

    const unsubscribeNotifications = RealtimeService.subscribeToNotifications(
      'general',
      (message) => {
        console.log('Notification:', message);
        // Here you could trigger a toast notification
      }
    );

    return () => {
      unsubscribeAppointments();
      unsubscribeNotifications();
    };
  }, [addAppointment, updateAppointment, removeAppointment]);
};
