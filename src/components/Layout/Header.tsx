
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
      <header className="bg-white/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 w-full shadow-sm">
        <div className="flex items-center justify-between p-4 w-full mobile-spacing">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10 shadow-sm">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary mobile-text-lg">Senhor Sorriso</h1>
              <p className="text-xs text-muted-foreground mobile-text-xs">Cuidando do seu sorriso</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative mobile-touch-target h-10 w-10 rounded-xl hover:bg-primary/10"
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
