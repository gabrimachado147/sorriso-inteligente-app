
import React from 'react';
import { ReminderManager } from '@/components/Reminders/ReminderManager';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

const RemindersPage = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <ReminderManager />
      </div>
    </ProtectedRoute>
  );
};

export default RemindersPage;
