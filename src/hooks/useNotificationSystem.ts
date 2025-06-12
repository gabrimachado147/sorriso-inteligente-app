
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

  // Sistema de notificações baseado em eventos reais
  useEffect(() => {
    if (!user) return;

    // As notificações agora só aparecem quando há eventos reais
    // Como agendamentos confirmados, lembretes, etc.
    
    return () => {
      // Cleanup se necessário
    };
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

  // Função para adicionar notificação real quando necessário
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification
  };
};
