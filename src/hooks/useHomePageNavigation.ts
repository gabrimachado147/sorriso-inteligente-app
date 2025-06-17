
import { useNavigate } from 'react-router-dom';

export const useHomePageNavigation = () => {
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReschedule = () => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

  const handleViewUnits = () => {
    navigate('/clinics');
  };

  const handleScheduleClinic = (clinic: string, phone: string) => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'chat':
        navigate('/chat');
        break;
      case 'locations':
        navigate('/clinics');
        break;
      case 'appointments':
        navigate('/schedule');
        break;
      case 'emergency':
        navigate('/emergency');
        break;
      default:
        break;
    }
  };

  const handleEmergencyCall = () => {
    navigate('/emergency');
  };

  return {
    handleScheduleClick,
    handleReschedule,
    handleViewAllAppointments,
    handleViewUnits,
    handleScheduleClinic,
    handleQuickAction,
    handleEmergencyCall
  };
};
