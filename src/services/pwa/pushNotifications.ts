import { PWANotificationManager } from '../notifications'

export const notificationManager = PWANotificationManager.getInstance()

export function requestNotificationPermission() {
  return notificationManager.requestPermission()
}

export function showLocalNotification(options: Parameters<typeof notificationManager.showNotification>[0]) {
  return notificationManager.showNotification(options)
}
