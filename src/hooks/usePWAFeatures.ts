import { useEffect } from 'react'
import { usePWA } from './usePWA'
import { notificationManager, requestNotificationPermission } from '@/services/pwa/pushNotifications'
import { triggerSyncQueue } from '@/services/pwa/offlineSync'

export const usePWAFeatures = () => {
  const pwa = usePWA()

  useEffect(() => {
    notificationManager.initialize()
    triggerSyncQueue()
  }, [])

  return {
    ...pwa,
    requestNotificationPermission
  }
}
