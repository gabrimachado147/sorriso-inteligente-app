
import { useNavigate } from 'react-router-dom';
import { toastInfo } from '@/components/ui/custom-toast';

export const useHomePageNavigation = () => {
  const navigate = useNavigate();

  const handleViewUnits = () => {
    navigate('/clinics');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReschedule = (appointmentId?: string) => {
    if (appointmentId) {
      navigate(`/schedule?reschedule=${appointmentId}`);
    } else {
      navigate('/schedule');
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleScheduleClinic = (clinicId?: string) => {
    const url = clinicId ? `/schedule?clinic=${clinicId}` : '/schedule';
    navigate(url);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleQuickAction = (action: string) => {
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

  const handleEmergencyCall = () => {
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
