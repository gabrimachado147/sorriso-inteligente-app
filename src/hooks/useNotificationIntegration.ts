
import { useEffect, useState } from 'react';
import { useEnhancedNotifications } from '@/services/enhanced-notifications';
import { toastSuccess, toastError, toastInfo } from '@/components/ui/custom-toast';

export const useNotificationIntegration = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    isSupported,
    permission,
    requestPermission,
    scheduleAppointmentReminder,
    notifyAppointmentConfirmed,
    testNotification
  } = useEnhancedNotifications();

  useEffect(() => {
    if (isSupported && !isInitialized) {
      setIsInitialized(true);
      
      // Auto-request permission if not already granted
      if (permission === 'default') {
        setTimeout(() => {
          showPermissionPrompt();
        }, 2000); // Wait 2 seconds after page load
      }
    }
  }, [isSupported, permission, isInitialized]);

  const showPermissionPrompt = async () => {
    const result = await requestPermission();
    
    if (result) {
      toastSuccess("Notificações", "Notificações ativadas! Você receberá lembretes dos seus agendamentos.");
      // Show test notification
      setTimeout(() => {
        testNotification();
      }, 1000);
    } else {
      toastInfo("Notificações", "Você pode ativar as notificações a qualquer momento nas configurações.");
    }
  };

  const handleAppointmentScheduled = async (appointmentData: {
    service: string;
    clinic: string;
    date: string;
    time: string;
    doctor?: string;
  }) => {
    try {
      // Notify appointment confirmed
      await notifyAppointmentConfirmed(appointmentData);
      
      // Schedule reminder
      const reminderResult = await scheduleAppointmentReminder(appointmentData);
      
      if (reminderResult.success) {
        console.log('✅ Lembrete agendado com sucesso');
      } else {
        console.warn('⚠️ Não foi possível agendar lembrete:', reminderResult.error);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao processar notificações de agendamento:', error);
      return false;
    }
  };

  const showNotificationStatus = () => {
    if (!isSupported) {
      toastError("Notificações", "Seu navegador não suporta notificações.");
      return;
    }

    switch (permission) {
      case 'granted':
        toastSuccess("Notificações", "Notificações estão ativas! 🔔");
        break;
      case 'denied':
        toastError("Notificações", "Notificações bloqueadas. Ative nas configurações do navegador.");
        break;
      case 'default':
        showPermissionPrompt();
        break;
    }
  };

  return {
    isSupported,
    permission,
    isInitialized,
    showPermissionPrompt,
    handleAppointmentScheduled,
    showNotificationStatus,
    testNotification
  };
};
