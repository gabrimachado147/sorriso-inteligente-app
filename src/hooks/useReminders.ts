
import { useState, useEffect } from 'react';
import { useNotifications } from '@/services/notifications';

export interface Reminder {
  id: string;
  type: 'appointment' | 'medication' | 'checkup' | 'custom';
  title: string;
  message: string;
  scheduledFor: Date;
  appointmentData?: {
    service: string;
    clinic: string;
    date: string;
    time: string;
  };
  recurring?: {
    enabled: boolean;
    interval: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  notificationSettings: {
    push: boolean;
    email: boolean;
    advanceTime: number; // em minutos
  };
  active: boolean;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { scheduleNotification, notifyAppointmentReminder } = useNotifications();

  useEffect(() => {
    loadReminders();
    setupReminderChecks();
  }, []);

  const loadReminders = () => {
    // Carregar lembretes do localStorage
    const stored = localStorage.getItem('user-reminders');
    if (stored) {
      const parsed = JSON.parse(stored).map((reminder: any) => ({
        ...reminder,
        scheduledFor: new Date(reminder.scheduledFor)
      }));
      setReminders(parsed);
    }
  };

  const saveReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders);
    localStorage.setItem('user-reminders', JSON.stringify(newReminders));
  };

  const createReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString()
    };

    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);

    // Agendar notificação
    scheduleReminderNotification(newReminder);
    
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, ...updates } : reminder
    );
    saveReminders(updatedReminders);
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
  };

  const scheduleReminderNotification = (reminder: Reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.scheduledFor.getTime() - (reminder.notificationSettings.advanceTime * 60 * 1000));
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0 && reminder.notificationSettings.push) {
      if (reminder.type === 'appointment' && reminder.appointmentData) {
        scheduleNotification({
          title: reminder.title,
          body: reminder.message,
          tag: `reminder-${reminder.id}`,
          data: {
            type: 'reminder',
            reminderId: reminder.id,
            url: '/profile'
          }
        }, delay);
      } else {
        scheduleNotification({
          title: reminder.title,
          body: reminder.message,
          tag: `reminder-${reminder.id}`,
          data: {
            type: 'reminder',
            reminderId: reminder.id,
            url: '/'
          }
        }, delay);
      }
    }
  };

  const setupReminderChecks = () => {
    // Verificar lembretes a cada minuto
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (reminder.active) {
          const reminderTime = new Date(reminder.scheduledFor.getTime() - (reminder.notificationSettings.advanceTime * 60 * 1000));
          
          if (now >= reminderTime && now < new Date(reminderTime.getTime() + 60000)) {
            triggerReminder(reminder);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  };

  const triggerReminder = (reminder: Reminder) => {
    if (reminder.type === 'appointment' && reminder.appointmentData) {
      notifyAppointmentReminder(reminder.appointmentData);
    } else {
      scheduleNotification({
        title: reminder.title,
        body: reminder.message,
        tag: `reminder-${reminder.id}`,
        data: {
          type: 'reminder',
          reminderId: reminder.id,
          url: '/'
        }
      }, 0);
    }

    // Se é recorrente, agendar próximo
    if (reminder.recurring?.enabled) {
      scheduleNextRecurrence(reminder);
    }
  };

  const scheduleNextRecurrence = (reminder: Reminder) => {
    if (!reminder.recurring) return;

    const nextDate = new Date(reminder.scheduledFor);
    
    switch (reminder.recurring.interval) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }

    if (!reminder.recurring.endDate || nextDate <= reminder.recurring.endDate) {
      updateReminder(reminder.id, { scheduledFor: nextDate });
    }
  };

  const getUpcomingReminders = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return reminders
      .filter(reminder => 
        reminder.active && 
        reminder.scheduledFor >= now && 
        reminder.scheduledFor <= futureDate
      )
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  };

  return {
    reminders,
    createReminder,
    updateReminder,
    deleteReminder,
    getUpcomingReminders,
    refreshReminders: loadReminders
  };
};
