
import React from 'react';
import { Bell } from 'lucide-react';

export const EmptyNotifications: React.FC = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
      <p>Nenhuma notificação</p>
    </div>
  );
};
