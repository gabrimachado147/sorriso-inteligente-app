
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const Icon = getIcon(notification.type);
  const colorClasses = getColor(notification.type);

  return (
    <div className={`p-4 border-b last:border-b-0 ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(notification.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs h-6 px-2"
              >
                Marcar como lida
              </Button>
            )}
            
            {notification.actionable && notification.actionLabel && (
              <Button
                variant="outline"
                size="sm"
                onClick={notification.action}
                className="text-xs h-6 px-2"
              >
                {notification.actionLabel}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(notification.id)}
              className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
            >
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
