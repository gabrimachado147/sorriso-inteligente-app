
import { useNavigate } from 'react-router-dom';
import { toastInfo } from '@/components/ui/custom-toast';

export const useHomeNavigation = () => {
  const navigate = useNavigate();

  const navigateToPage = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleScheduleNavigation = () => {
    navigateToPage('/schedule');
  };

  const handleAuthNavigation = () => {
    navigateToPage('/auth');
  };

  const handleClinicsNavigation = () => {
    navigateToPage('/clinics');
  };

  const handleChatNavigation = () => {
    navigateToPage('/chat');
  };

  const handleEmergencyNavigation = () => {
    navigateToPage('/emergency');
  };

  return {
    navigateToPage,
    handleScheduleNavigation,
    handleAuthNavigation,
    handleClinicsNavigation,
    handleChatNavigation,
    handleEmergencyNavigation
  };
};
