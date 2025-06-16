
export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: Record<string, unknown>;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export class EnhancedNotificationService {
  private static instance: EnhancedNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): EnhancedNotificationService {
    if (!EnhancedNotificationService.instance) {
      EnhancedNotificationService.instance = new EnhancedNotificationService();
    }
    return EnhancedNotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.ready;
      }
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async showNotification(config: NotificationConfig): Promise<void> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    if (this.registration) {
      // Use service worker notification for better persistence
      await this.registration.showNotification(config.title, {
        body: config.body,
        icon: config.icon || '/icons/icon-192x192.png',
        badge: config.badge || '/icons/icon-72x72.png',
        tag: config.tag || 'default',
        requireInteraction: config.requireInteraction || false,
        silent: config.silent || false,
        data: config.data || {}
      });
    } else {
      // Fallback to basic notification
      new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icons/icon-192x192.png',
        tag: config.tag || 'default',
        requireInteraction: config.requireInteraction || false,
        silent: config.silent || false,
        data: config.data || {}
      });
    }
  }

  async scheduleNotification(config: NotificationConfig, delay: number): Promise<string> {
    const notificationId = `scheduled-${Date.now()}-${Math.random()}`;
    
    setTimeout(async () => {
      try {
        await this.showNotification({
          ...config,
          tag: notificationId
        });
      } catch (error) {
        console.error('Failed to show scheduled notification:', error);
      }
    }, delay);

    return notificationId;
  }

  async clearNotification(tag: string): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    }
  }

  async clearAllNotifications(): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export const notificationService = EnhancedNotificationService.getInstance();
