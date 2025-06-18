
import React, { useState, useEffect } from 'react';
import { animations } from '@/lib/animations';
import { RealtimeNotificationsProps } from './RealtimeNotifications/types';
import { NotificationButton } from './RealtimeNotifications/NotificationButton';
import { NotificationHeader } from './RealtimeNotifications/NotificationHeader';
import { NotificationItem } from './RealtimeNotifications/NotificationItem';
import { EmptyNotifications } from './RealtimeNotifications/EmptyNotifications';

export type { Notification } from './RealtimeNotifications/types';

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
      const timer = setTimeout(() => {
        setHasNewNotifications(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="relative">
      <NotificationButton
        unreadCount={unreadCount}
        hasNewNotifications={hasNewNotifications}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-12 w-80 max-h-96 bg-white border rounded-lg shadow-lg z-50 overflow-hidden ${animations.fadeIn}`}>
            <NotificationHeader
              unreadCount={unreadCount}
              onMarkAllAsRead={onMarkAllAsRead}
              onClose={() => setIsOpen(false)}
            />

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyNotifications />
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
