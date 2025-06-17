
import React, { useState } from 'react';
import { Bell, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { NotificationDrawer } from './NotificationDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotificationSystem();

  // Add logging to debug auth state in header
  React.useEffect(() => {
    console.log('Header: Auth state:', {
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email
      } : null,
      loading
    });
  }, [isAuthenticated, user, loading]);

  const handleStaffAccess = () => {
    navigate('/staff-login');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between p-4 w-full mobile-spacing">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary mobile-text-lg">Senhor Sorriso</h1>
          </div>

          <div className="flex items-center space-x-3">
            {!loading && isAuthenticated && (
              <Button 
                variant="default"
                size="sm"
                onClick={handleStaffAccess}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg mobile-touch-target text-xs md:text-sm px-2 md:px-4"
              >
                <UserCog className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Painel Admin</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative mobile-touch-target"
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
