
import { useNavigate } from 'react-router-dom';
import { toastInfo } from '@/components/ui/custom-toast';

type QuickAction = 'schedule' | 'chat' | 'clinics' | 'emergency' | string;

interface HomePageNavigationActions {
  handleViewUnits: () => void;
  handleReschedule: (appointmentId?: string) => void;
  handleViewAllAppointments: () => void;
  handleScheduleClinic: (clinicId?: string) => void;
  handleQuickAction: (action: QuickAction) => void;
  handleEmergencyCall: () => void;
}

export const useHomePageNavigation = (): HomePageNavigationActions => {
  const navigate = useNavigate();

  const handleViewUnits = (): void => {
    navigate('/clinics');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReschedule = (appointmentId?: string): void => {
    if (appointmentId) {
      navigate(`/schedule?reschedule=${appointmentId}`);
    } else {
      navigate('/schedule');
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAllAppointments = (): void => {
    navigate('/appointments');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleScheduleClinic = (clinicId?: string): void => {
    const url = clinicId ? `/schedule?clinic=${clinicId}` : '/schedule';
    navigate(url);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleQuickAction = (action: QuickAction): void => {
    switch (action) {
      case 'schedule':
        navigate('/schedule');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'clinics':
        navigate('/clinics');
        break;
      case 'emergency':
        navigate('/emergency');
        break;
      default:
        toastInfo('Ação', `Navegando para ${action}`);
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEmergencyCall = (): void => {
    try {
      const emergencyPhone = 'tel:+5535998913803';
      window.location.href = emergencyPhone;
      toastInfo('Emergência', 'Conectando com atendimento de emergência...');
    } catch (error) {
      console.error('Error making emergency call:', error);
    }
  };

  return {
    handleViewUnits,
    handleReschedule,
    handleViewAllAppointments,
    handleScheduleClinic,
    handleQuickAction,
    handleEmergencyCall
  };
};
