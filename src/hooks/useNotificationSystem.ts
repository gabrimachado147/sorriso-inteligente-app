
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNotifications } from '@/services/notifications';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'promotion' | 'reminder' | 'system';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const useNotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { scheduleNotification } = useNotifications();

  // Simular notificações inteligentes baseadas no usuário
  useEffect(() => {
    if (!user) return;

    const generateSmartNotifications = () => {
      const now = new Date();
      const newNotifications: Notification[] = [];

      // Lembrete de consulta (simulado)
      newNotifications.push({
        id: '1',
        title: 'Consulta Agendada',
        message: 'Você tem uma consulta marcada para amanhã às 14:00 com Dr. Silva',
        type: 'appointment',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        actionUrl: '/appointments'
      });

      // Promoção especial
      newNotifications.push({
        id: '2',
        title: 'Oferta Especial! 🎉',
        message: '30% de desconto em limpeza dental. Válido até sexta-feira!',
        type: 'promotion',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 dia atrás
        read: false,
        actionUrl: '/appointments'
      });

      // Lembrete de higiene
      newNotifications.push({
        id: '3',
        title: 'Lembrete de Cuidados 🦷',
        message: 'Não esqueça de escovar os dentes antes de dormir!',
        type: 'reminder',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
        read: true
      });

      setNotifications(newNotifications);
    };

    // Gerar notificações depois de um pequeno delay
    const timer = setTimeout(generateSmartNotifications, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
