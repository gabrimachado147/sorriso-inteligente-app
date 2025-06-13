
import { useQuery } from '@tanstack/react-query'
import { AnalyticsService, type AnalyticsDashboardStats, type ChatConversionData } from '@/services/analytics'

export const useAnalytics = (clinicId?: string) => {
  const { 
    data: dashboardStats, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['dashboard-stats', clinicId],
    queryFn: () => AnalyticsService.getDashboardStats(clinicId),
  })

  const { 
    data: chatConversion, 
    isLoading: conversionLoading 
  } = useQuery({
    queryKey: ['chat-conversion', clinicId],
    queryFn: () => AnalyticsService.getChatConversionReport(clinicId),
  })

  const trackEvent = (eventType: string, data: Record<string, any>) => {
    return AnalyticsService.trackEvent(eventType, data, clinicId)
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
  })
}

export const useHealthAnalytics = () => {
  return useAnalytics()
}
