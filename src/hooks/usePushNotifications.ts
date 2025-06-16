
import { useState, useEffect, useCallback } from 'react';

interface NotificationData {
  name: string;
  date: string;
  time: string;
  clinic: string;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.log('[PushNotifications] Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[PushNotifications] Error requesting permission:', error);
      return false;
    }
  }, [isSupported]);

  const notifyNewAppointment = useCallback((data: NotificationData) => {
    if (permission !== 'granted') {
      console.log('[PushNotifications] Permission not granted, skipping notification');
      return;
    }

    try {
      const notification = new Notification('🎉 Novo Agendamento via Chat!', {
        body: `${data.name} agendou para ${data.date} às ${data.time}\nClínica: ${data.clinic}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'new-appointment',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        // Navigate to appointments page
        window.location.href = '/admin-dashboard';
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

    } catch (error) {
      console.error('[PushNotifications] Error showing notification:', error);
    }
  }, [permission]);

  const notifyAppointmentConfirmed = useCallback((data: NotificationData) => {
    if (permission !== 'granted') return;

    try {
      new Notification('✅ Agendamento Confirmado', {
        body: `${data.name} - ${data.date} às ${data.time}`,
        icon: '/icons/icon-192x192.png',
        tag: 'appointment-confirmed'
      });
    } catch (error) {
      console.error('[PushNotifications] Error showing confirmation notification:', error);
    }
  }, [permission]);

  const notifyAppointmentReminder = useCallback((data: NotificationData) => {
    if (permission !== 'granted') return;

    try {
      new Notification('⏰ Lembrete de Consulta', {
        body: `Sua consulta é amanhã: ${data.date} às ${data.time}`,
        icon: '/icons/icon-192x192.png',
        tag: 'appointment-reminder'
      });
    } catch (error) {
      console.error('[PushNotifications] Error showing reminder notification:', error);
    }
  }, [permission]);

  return {
    permission,
    isSupported,
    requestPermission,
    notifyNewAppointment,
    notifyAppointmentConfirmed,
    notifyAppointmentReminder
  };
};
