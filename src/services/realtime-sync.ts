import { supabase } from '@/integrations/supabase/client';
import { useOfflineManager } from './offline-manager';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export interface RealtimeSyncConfig {
  enableAppointments: boolean;
  enableUserProfiles: boolean;
  enableNotifications: boolean;
}

class RealtimeSyncService {
  private static instance: RealtimeSyncService;
  private channels: Map<string, unknown> = new Map();
  private offlineManager = useOfflineManager;

  static getInstance(): RealtimeSyncService {
    if (!RealtimeSyncService.instance) {
      RealtimeSyncService.instance = new RealtimeSyncService();
    }
    return RealtimeSyncService.instance;
  }

  async initializeSync(config: RealtimeSyncConfig) {
    console.log('[Realtime] Initializing sync with config:', config);

    if (config.enableAppointments) {
      await this.setupAppointmentsSync();
    }

    if (config.enableUserProfiles) {
      await this.setupUserProfilesSync();
    }

    if (config.enableNotifications) {
      await this.setupNotificationsSync();
    }
  }

  private async setupAppointmentsSync() {
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('[Realtime] Appointment change:', payload);
          this.handleAppointmentChange(payload);
        }
      )
      .subscribe();

    this.channels.set('appointments', appointmentsChannel);
  }

  private async setupUserProfilesSync() {
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('[Realtime] Profile change:', payload);
          this.handleProfileChange(payload);
        }
      )
      .subscribe();

    this.channels.set('profiles', profilesChannel);
  }

  private async setupNotificationsSync() {
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reminders'
        },
        (payload) => {
          console.log('[Realtime] New notification:', payload);
          this.handleNotificationChange(payload);
        }
      )
      .subscribe();

    this.channels.set('notifications', notificationsChannel);
  }

  private handleAppointmentChange(payload: unknown) {
    const eventPayload = payload as { eventType: string };
    switch (eventPayload.eventType) {
      case 'INSERT':
        toastSuccess('Novo Agendamento', 'Um novo agendamento foi criado');
        break;
      case 'UPDATE':
        toastSuccess('Agendamento Atualizado', 'Status do agendamento foi alterado');
        break;
      case 'DELETE':
        toastError('Agendamento Cancelado', 'Um agendamento foi cancelado');
        break;
    }

    // Trigger UI updates
    window.dispatchEvent(new CustomEvent('appointment-updated', {
      detail: payload
    }));
  }

  private handleProfileChange(payload: unknown) {
    console.log('[Realtime] Profile updated:', payload);
    
    // Trigger UI updates
    window.dispatchEvent(new CustomEvent('profile-updated', {
      detail: payload
    }));
  }

  private handleNotificationChange(payload: unknown) {
    const notificationPayload = payload as { new: unknown };
    const notification = notificationPayload.new;
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('Lembrete de Consulta', {
        body: 'Você tem uma consulta agendada em breve',
        icon: '/icons/icon-192x192.png'
      });
    }

    // Trigger UI updates
    window.dispatchEvent(new CustomEvent('notification-received', {
      detail: notification
    }));
  }

  async syncOfflineData() {
    try {
      console.log('[Realtime] Starting offline sync...');
      
      // Get offline appointments
      const offlineAppointments = await this.offlineManager().getOfflineAppointments();
      
      for (const appointment of offlineAppointments) {
        try {
          // Try to sync with server
          const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointment.data)
          });

          if (response.ok) {
            // Mark as synced
            console.log('[Realtime] Synced appointment:', appointment.id);
          }
        } catch (error) {
          console.error('[Realtime] Failed to sync appointment:', error);
        }
      }

      toastSuccess('Sincronização', 'Dados offline sincronizados com sucesso');
    } catch (error) {
      console.error('[Realtime] Sync failed:', error);
      toastError('Erro de Sincronização', 'Falha ao sincronizar dados offline');
    }
  }

  cleanup() {
    console.log('[Realtime] Cleaning up channels...');
    
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
      console.log(`[Realtime] Removed channel: ${name}`);
    });
    
    this.channels.clear();
  }
}

export const realtimeSyncService = RealtimeSyncService.getInstance();
