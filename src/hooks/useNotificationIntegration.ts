
import { useEffect, useState } from 'react';
import { notificationService } from '@/services/enhanced-notifications';
import { toastSuccess, toastError, toastInfo } from '@/components/ui/custom-toast';

export const useNotificationIntegration = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      if (notificationService.isSupported() && !isInitialized) {
        await notificationService.initialize();
        setIsInitialized(true);
        
        // Auto-request permission if not already granted
        if (notificationService.getPermissionStatus() === 'default') {
          setTimeout(() => {
            showPermissionPrompt();
          }, 2000); // Wait 2 seconds after page load
        }
      }
    };

    initializeNotifications();
  }, [isInitialized]);

  const showPermissionPrompt = async () => {
    try {
      const permission = await notificationService.requestPermission();
      
      if (permission === 'granted') {
        toastSuccess("Notificações", "Notificações ativadas! Você receberá lembretes dos seus agendamentos.");
        // Show test notification
        setTimeout(() => {
          testNotification();
        }, 1000);
      } else {
        toastInfo("Notificações", "Você pode ativar as notificações a qualquer momento nas configurações.");
      }
    } catch (error) {
      toastError("Notificações", "Erro ao solicitar permissão para notificações.");
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
      await notificationService.showNotification({
        title: "Agendamento Confirmado",
        body: `Seu agendamento de ${appointmentData.service} na ${appointmentData.clinic} foi confirmado para ${appointmentData.date} às ${appointmentData.time}.`,
        tag: 'appointment-confirmed'
      });
      
      // Schedule reminder for 1 hour before
      const appointmentDateTime = new Date(`${appointmentData.date} ${appointmentData.time}`);
      const reminderTime = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000); // 1 hour before
      const delayMs = reminderTime.getTime() - Date.now();
      
      if (delayMs > 0) {
        await notificationService.scheduleNotification({
          title: "Lembrete de Agendamento",
          body: `Seu agendamento de ${appointmentData.service} na ${appointmentData.clinic} é em 1 hora.`,
          tag: 'appointment-reminder'
        }, delayMs);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao processar notificações de agendamento:', error);
      return false;
    }
  };

  const showNotificationStatus = () => {
    if (!notificationService.isSupported()) {
      toastError("Notificações", "Seu navegador não suporta notificações.");
      return;
    }

    const permission = notificationService.getPermissionStatus();
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

  const testNotification = async () => {
    try {
      await notificationService.showNotification({
        title: "Teste de Notificação",
        body: "As notificações estão funcionando corretamente!",
        tag: 'test-notification'
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
    }
  };

  return {
    isSupported: notificationService.isSupported(),
    permission: notificationService.getPermissionStatus(),
    isInitialized,
    showPermissionPrompt,
    handleAppointmentScheduled,
    showNotificationStatus,
    testNotification
  };
};
