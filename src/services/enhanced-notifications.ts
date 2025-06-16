import * as React from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
}

interface AppointmentNotification {
  service: string;
  clinic: string;
  date: string;
  time: string;
  doctor?: string;
}

interface ScheduleResult {
  success: boolean;
  notificationId?: string;
  error?: string;
}

export class EnhancedNotificationService {
  private static instance: EnhancedNotificationService;
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  static getInstance(): EnhancedNotificationService {
    if (!EnhancedNotificationService.instance) {
      EnhancedNotificationService.instance = new EnhancedNotificationService();
    }
    return EnhancedNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    console.log('🔔 Inicializando sistema de notificações...');
    
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    // Registrar Service Worker se não estiver registrado
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado para notificações');
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }

    this.permission = Notification.permission;
    return this.permission === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('📱 Permissão de notificação:', this.permission);
      return this.permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  async showNotification(options: NotificationOptions): Promise<boolean> {
    if (this.permission !== 'granted') {
      console.warn('Permissão de notificação não concedida');
      return false;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.svg',
        badge: options.badge || '/icons/icon-72x72.svg',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Handle data if present
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };

      return true;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return false;
    }
  }

  async scheduleAppointmentReminder(appointment: AppointmentNotification): Promise<ScheduleResult> {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const reminderTime = new Date(appointmentDate.getTime() - 60 * 60 * 1000); // 1 hora antes
    
    const now = new Date();
    if (reminderTime <= now) {
      return {
        success: false,
        error: 'Não é possível agendar lembrete para o passado'
      };
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    const notificationId = setTimeout(async () => {
      await this.showNotification({
        title: '🦷 Lembrete de Consulta',
        body: `Sua consulta de ${appointment.service} na ${appointment.clinic} é em 1 hora (${appointment.time})`,
        tag: `appointment-${appointment.date}-${appointment.time}`,
        requireInteraction: true,
        data: {
          type: 'appointment-reminder',
          appointment,
          url: '/appointments'
        }
      });
    }, timeUntilReminder);

    console.log(`⏰ Lembrete agendado para ${reminderTime.toLocaleString()}`);

    return {
      success: true,
      notificationId: notificationId.toString()
    };
  }

  async notifyAppointmentConfirmed(appointment: AppointmentNotification): Promise<boolean> {
    return await this.showNotification({
      title: '✅ Consulta Confirmada!',
      body: `${appointment.service} agendada para ${appointment.date} às ${appointment.time} na ${appointment.clinic}`,
      tag: 'appointment-confirmed',
      data: {
        type: 'appointment-confirmed',
        appointment,
        url: '/appointments'
      }
    });
  }

  async notifyAppointmentCanceled(appointment: AppointmentNotification): Promise<boolean> {
    return await this.showNotification({
      title: '❌ Consulta Cancelada',
      body: `Sua consulta de ${appointment.service} de ${appointment.date} às ${appointment.time} foi cancelada`,
      tag: 'appointment-canceled',
      data: {
        type: 'appointment-canceled',
        appointment
      }
    });
  }

  async notifyPromotion(title: string, message: string): Promise<boolean> {
    return await this.showNotification({
      title: `🎉 ${title}`,
      body: message,
      tag: 'promotion',
      data: {
        type: 'promotion',
        url: '/'
      }
    });
  }

  async notifyEmergency(): Promise<boolean> {
    return await this.showNotification({
      title: '🚨 Emergência Dental',
      body: 'Linha de emergência ativada. Aguarde o contato.',
      tag: 'emergency',
      requireInteraction: true,
      data: {
        type: 'emergency',
        url: '/emergency'
      }
    });
  }

  // Método para testar notificações
  async testNotification(): Promise<boolean> {
    return await this.showNotification({
      title: '🦷 Senhor Sorriso',
      body: 'Notificações ativadas com sucesso! Você receberá lembretes dos seus agendamentos.',
      tag: 'test-notification'
    });
  }

  cancelScheduledNotification(notificationId: string): void {
    clearTimeout(parseInt(notificationId));
    console.log(`🔕 Notificação ${notificationId} cancelada`);
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}

// Hook para usar o serviço de notificações
export const useEnhancedNotifications = () => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>('default');
  const notificationService = React.useRef(EnhancedNotificationService.getInstance());

  React.useEffect(() => {
    const initializeNotifications = async () => {
      const supported = notificationService.current.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        await notificationService.current.initialize();
        setPermission(notificationService.current.getPermissionStatus());
      }
    };

    initializeNotifications();
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.current.requestPermission();
    setPermission(notificationService.current.getPermissionStatus());
    return granted;
  };

  const scheduleAppointmentReminder = (appointment: AppointmentNotification) => {
    return notificationService.current.scheduleAppointmentReminder(appointment);
  };

  const notifyAppointmentConfirmed = (appointment: AppointmentNotification) => {
    return notificationService.current.notifyAppointmentConfirmed(appointment);
  };

  const testNotification = () => {
    return notificationService.current.testNotification();
  };

  return {
    isSupported,
    permission,
    requestPermission,
    scheduleAppointmentReminder,
    notifyAppointmentConfirmed,
    testNotification,
    notificationService: notificationService.current
  };
};

// Export da instância singleton
export const notificationService = EnhancedNotificationService.getInstance();
