
import { useQuery } from '@tanstack/react-query'
import { AnalyticsService, type DashboardStats } from '@/services/analytics'

export const useAnalytics = (clinicId?: string) => {
  // Dashboard stats
  const {
    data: dashboardStats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['dashboard-stats', clinicId],
    queryFn: () => AnalyticsService.getDashboardStats(clinicId),
    refetchInterval: 5 * 60 * 1000 // Atualizar a cada 5 minutos
  })

  // Chat conversion report
  const {
    data: chatConversion,
    isLoading: conversionLoading
  } = useQuery({
    queryKey: ['chat-conversion', clinicId],
    queryFn: () => AnalyticsService.getChatConversionReport(clinicId),
    refetchInterval: 5 * 60 * 1000
  })

  // Track event function
  const trackEvent = (eventType: string, data: Record<string, any>) => {
    AnalyticsService.trackEvent(eventType, data, clinicId)
  }

  return {
    dashboardStats,
    chatConversion,
    statsLoading,
    conversionLoading,
    trackEvent
  }
}

export const useAppointmentsByPeriod = (startDate: string, endDate: string, clinicId?: string) => {
  return useQuery({
    queryKey: ['appointments-by-period', startDate, endDate, clinicId],
    queryFn: () => AnalyticsService.getAppointmentsByPeriod(startDate, endDate, clinicId),
    enabled: !!startDate && !!endDate
  })
}
