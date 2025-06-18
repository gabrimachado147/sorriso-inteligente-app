
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onMarkAllAsRead,
  onClose
}) => {
  return (
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
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
