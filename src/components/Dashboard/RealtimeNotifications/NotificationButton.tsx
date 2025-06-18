
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationButtonProps {
  unreadCount: number;
  hasNewNotifications: boolean;
  onClick: () => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  unreadCount,
  hasNewNotifications,
  onClick
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
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
  );
};
