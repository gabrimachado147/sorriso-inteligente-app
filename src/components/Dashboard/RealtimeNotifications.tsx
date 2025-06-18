
import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface RealtimeNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
}

export const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotifications(true);
      // Auto-hide the new notification indicator after 3 seconds
      const timer = setTimeout(() => {
        setHasNewNotifications(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': 
        return CheckCircle;
      case 'warning': 
        return AlertTriangle;
      case 'error': 
        return AlertCircle;
      case 'info':
      default: 
        return Info;
    }
  };

  const getColor = (type: Notification['type']): string => {
    switch (type) {
      case 'success': 
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': 
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': 
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default: 
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {hasNewNotifications && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-12 w-80 max-h-96 bg-white border rounded-lg shadow-lg z-50 ${animations.fadeIn}`}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getIcon(notification.type);
                  return (
                    <Card 
                      key={notification.id}
                      className={`m-2 border ${getColor(notification.type)} ${!notification.read ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{formatTime(notification.timestamp)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(notification.id)}
                                className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              {!notification.read && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="text-xs h-6"
                                >
                                  Marcar como lida
                                </Button>
                              )}
                              {notification.actionable && notification.action && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={notification.action}
                                  className="text-xs h-6"
                                >
                                  {notification.actionLabel || 'Ação'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
