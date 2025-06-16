
import { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export interface PushNotificationConfig {
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
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar se notificações são suportadas
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toastError('Erro', 'Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toastSuccess('Sucesso', 'Notificações ativadas com sucesso!');
        return true;
      } else {
        toastError('Erro', 'Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toastError('Erro', 'Erro ao solicitar permissão para notificações');
      return false;
    }
  };

  const showNotification = async (config: PushNotificationConfig): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notificações não suportadas');
      return false;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icons/icon-192x192.png',
        badge: config.badge || '/icons/icon-72x72.png',
        tag: config.tag || 'senhor-sorriso',
        data: config.data,
        requireInteraction: true,
        silent: false
      });

      // Auto-close após 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Eventos da notificação
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Se há dados, navegar para URL específica
        if (config.data?.url) {
          window.location.href = config.data.url;
        }
      };

      return true;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return false;
    }
  };

  const notifyNewAppointment = (appointmentData: {
    name: string;
    date: string;
    time: string;
    clinic: string;
  }) => {
    return showNotification({
      title: '🦷 Novo Agendamento!',
      body: `${appointmentData.name} agendou para ${appointmentData.date} às ${appointmentData.time}`,
      tag: 'new-appointment',
      data: {
        type: 'appointment',
        appointmentData,
        url: '/admin'
      }
    });
  };

  const notifyAppointmentConfirmed = (appointmentData: {
    name: string;
    date: string;
    time: string;
    clinic: string;
  }) => {
    return showNotification({
      title: '✅ Agendamento Confirmado',
      body: `Sua consulta foi confirmada para ${appointmentData.date} às ${appointmentData.time}`,
      tag: 'appointment-confirmed',
      data: {
        type: 'confirmation',
        appointmentData,
        url: '/profile'
      }
    });
  };

  const notifyAppointmentReminder = (appointmentData: {
    name: string;
    date: string;
    time: string;
    clinic: string;
  }) => {
    return showNotification({
      title: '⏰ Lembrete de Consulta',
      body: `Sua consulta é amanhã às ${appointmentData.time} na ${appointmentData.clinic}`,
      tag: 'appointment-reminder',
      data: {
        type: 'reminder',
        appointmentData,
        url: '/profile'
      }
    });
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    notifyNewAppointment,
    notifyAppointmentConfirmed,
    notifyAppointmentReminder
  };
};
