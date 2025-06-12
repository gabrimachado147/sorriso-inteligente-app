// Gerenciador de notificações PWA
export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  silent?: boolean;
  vibrate?: number[];
  requireInteraction?: boolean;
}

export class PWANotificationManager {
  private static instance: PWANotificationManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): PWANotificationManager {
    if (!PWANotificationManager.instance) {
      PWANotificationManager.instance = new PWANotificationManager();
    }
    return PWANotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      console.log('[PWA] Notification manager initialized');
      return true;
    } catch (error) {
      console.error('[PWA] Failed to initialize notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    console.log('[PWA] Notification permission:', permission);
    return permission;
  }

  async showNotification(options: NotificationOptions): Promise<boolean> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('[PWA] Notification permission denied');
      return false;
    }

    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      console.error('[PWA] Service Worker not ready');
      return false;
    }

    const notificationOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      vibrate: [200, 100, 200],
      ...options,
      data: {
        ...options.data,
        timestamp: Date.now(),
        url: options.data?.url || '/'
      }
    };

    try {
      await this.registration.showNotification(options.title, notificationOptions);
      console.log('[PWA] Notification shown:', options.title);
      return true;
    } catch (error) {
      console.error('[PWA] Failed to show notification:', error);
      return false;
    }
  }

  // Notificações específicas do app
  async notifyAppointmentReminder(appointmentData: {
    service: string;
    clinic: string;
    date: string;
    time: string;
  }): Promise<boolean> {
    return this.showNotification({
      title: '🦷 Lembrete de Consulta',
      body: `${appointmentData.service} na ${appointmentData.clinic} hoje às ${appointmentData.time}`,
      tag: 'appointment-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Detalhes',
          icon: '/icons/action-view.svg'
        },
        {
          action: 'reschedule',
          title: 'Remarcar',
          icon: '/icons/action-reschedule.svg'
        }
      ],
      data: {
        type: 'appointment-reminder',
        appointmentData,
        url: '/profile'
      }
    });
  }

  async notifyAppointmentConfirmed(appointmentData: {
    service: string;
    clinic: string;
    date: string;
    time: string;
  }): Promise<boolean> {
    return this.showNotification({
      title: '✅ Consulta Confirmada',
      body: `${appointmentData.service} agendada para ${appointmentData.date} às ${appointmentData.time}`,
      tag: 'appointment-confirmed',
      actions: [
        {
          action: 'view',
          title: 'Ver Consultas',
          icon: '/icons/action-view.svg'
        },
        {
          action: 'add-calendar',
          title: 'Adicionar à Agenda',
          icon: '/icons/action-calendar.svg'
        }
      ],
      data: {
        type: 'appointment-confirmed',
        appointmentData,
        url: '/profile'
      }
    });
  }

  async notifyPromotion(promotion: {
    title: string;
    description: string;
    validUntil?: string;
  }): Promise<boolean> {
    return this.showNotification({
      title: `🎉 ${promotion.title}`,
      body: promotion.description,
      tag: 'promotion',
      actions: [
        {
          action: 'view',
          title: 'Ver Oferta',
          icon: '/icons/action-view.svg'
        },
        {
          action: 'schedule',
          title: 'Agendar',
          icon: '/icons/action-schedule.svg'
        }
      ],
      data: {
        type: 'promotion',
        promotion,
        url: '/schedule'
      }
    });
  }

  async notifyOfflineMode(): Promise<boolean> {
    return this.showNotification({
      title: '📱 Modo Offline Ativo',
      body: 'Você está navegando offline. Algumas funcionalidades podem estar limitadas.',
      tag: 'offline-mode',
      silent: true,
      data: {
        type: 'offline-mode',
        url: '/'
      }
    });
  }

  async notifyUpdateAvailable(): Promise<boolean> {
    return this.showNotification({
      title: '🔄 Atualização Disponível',
      body: 'Uma nova versão do app está disponível. Toque para atualizar.',
      tag: 'app-update',
      requireInteraction: true,
      actions: [
        {
          action: 'update',
          title: 'Atualizar Agora',
          icon: '/icons/action-update.svg'
        },
        {
          action: 'later',
          title: 'Mais Tarde',
          icon: '/icons/action-dismiss.svg'
        }
      ],
      data: {
        type: 'app-update',
        url: '/'
      }
    });
  }

  // Gerenciar notificações existentes
  async getActiveNotifications(): Promise<Notification[]> {
    if (!this.registration) return [];

    try {
      return await this.registration.getNotifications();
    } catch (error) {
      console.error('[PWA] Failed to get notifications:', error);
      return [];
    }
  }

  async clearNotifications(tag?: string): Promise<void> {
    const notifications = await this.getActiveNotifications();
    
    notifications.forEach(notification => {
      if (!tag || notification.tag === tag) {
        notification.close();
      }
    });
  }

  // Agendar notificações (simulado)
  async scheduleNotification(options: NotificationOptions, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }
}

// Hook para usar notificações
export const useNotifications = () => {
  const manager = PWANotificationManager.getInstance();

  return {
    requestPermission: () => manager.requestPermission(),
    showNotification: (options: NotificationOptions) => manager.showNotification(options),
    notifyAppointmentReminder: (data: any) => manager.notifyAppointmentReminder(data),
    notifyAppointmentConfirmed: (data: any) => manager.notifyAppointmentConfirmed(data),
    notifyPromotion: (data: any) => manager.notifyPromotion(data),
    notifyOfflineMode: () => manager.notifyOfflineMode(),
    notifyUpdateAvailable: () => manager.notifyUpdateAvailable(),
    clearNotifications: (tag?: string) => manager.clearNotifications(tag),
    scheduleNotification: (options: NotificationOptions, delay: number) => 
      manager.scheduleNotification(options, delay)
  };
};
