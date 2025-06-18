
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Notification } from './types';
import { getIcon, getColor, formatTime } from './utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss
}) => {
  const IconComponent = getIcon(notification.type);

  return (
    <Card 
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
};
