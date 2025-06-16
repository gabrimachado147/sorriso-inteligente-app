
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotificationSystem();

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Senhor Sorriso</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationDrawerOpen(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <NotificationDrawer
        open={notificationDrawerOpen}
        onOpenChange={setNotificationDrawerOpen}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onRemoveNotification={removeNotification}
      />
    </>
  );
};
