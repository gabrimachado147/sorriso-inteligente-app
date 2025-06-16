
import React from 'react';
import { ReminderManager } from '@/components/Reminders/ReminderManager';

const RemindersPage = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mobile-text-xl">Lembretes</h1>
          <p className="text-muted-foreground mobile-text-base">
            Gerencie seus lembretes e notificações
          </p>
        </div>
        <ReminderManager />
      </div>
    </div>
  );
};

export default RemindersPage;
