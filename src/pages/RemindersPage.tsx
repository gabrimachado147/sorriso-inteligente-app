
import React from 'react';
import { ReminderManager } from '@/components/Reminders/ReminderManager';
import { animations } from '@/lib/animations';

const RemindersPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mobile-text-xl">Lembretes</h1>
        <p className="text-muted-foreground mobile-text-base mt-2">
          Gerencie seus lembretes e notificações
        </p>
      </div>
      <ReminderManager />
    </div>
  );
};

export default RemindersPage;
