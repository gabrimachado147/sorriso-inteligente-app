import PWAOfflineManager from '../offline-manager'
import { appointmentService } from '../supabase/appointments'

// Sync any stored appointments when online
export async function syncOfflineAppointments(): Promise<void> {
  const manager = PWAOfflineManager.getInstance()
  const appointments = await manager.getOfflineAppointments()

  for (const item of appointments) {
    try {
      await appointmentService.create(item.data)
      // cleanup would normally remove the item from IndexedDB
    } catch (err) {
      console.error('[PWA] Failed to sync appointment', err)
    }
  }
}

// Manual trigger for the internal sync queue
export function triggerSyncQueue(): void {
  const manager = PWAOfflineManager.getInstance() as any
  if (typeof manager.processSyncQueue === 'function') {
    manager.processSyncQueue()
  }
}
