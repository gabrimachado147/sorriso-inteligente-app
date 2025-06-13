
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

  const getAppointmentsByPeriod = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['appointments-by-period', startDate, endDate, clinicId],
      queryFn: () => AnalyticsService.getAppointmentsByPeriod(startDate, endDate, clinicId),
    })
  }

  const trackEvent = (eventType: string, data: Record<string, any>) => {
    return AnalyticsService.trackEvent(eventType, data, clinicId)
  }

  return {
    dashboardStats,
    chatConversion,
    statsLoading,
    conversionLoading,
    getAppointmentsByPeriod,
    trackEvent
  }
}

export const useHealthAnalytics = () => {
  return useAnalytics()
}
