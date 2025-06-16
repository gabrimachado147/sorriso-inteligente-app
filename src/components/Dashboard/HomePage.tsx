
import React from 'react';
import { toastSuccess } from '@/components/ui/custom-toast';
import { animations } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';
import { HeroWelcomeSection } from './HeroWelcomeSection';
import { QuickActionsGrid } from './QuickActionsGrid';
import { UnitsSection } from './UnitsSection';
import { AppointmentsSection } from './AppointmentsSection';
import { ServicesSection } from './ServicesSection';
import { ReviewsSection } from './ReviewsSection';
import { EmergencyContact } from './EmergencyContact';

const HomePage = () => {
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

  const schedulingLoading = false;
  const chatLoading = false;

  return (
    <div className={`p-4 space-y-6 ${animations.pageEnter}`}>
      <HeroWelcomeSection 
        onViewUnits={handleViewUnits}
        schedulingLoading={schedulingLoading}
      />

      <QuickActionsGrid onQuickAction={handleQuickAction} />

      <UnitsSection 
        onViewUnits={handleViewUnits}
        onScheduleClinic={handleScheduleClinic}
      />

      <AppointmentsSection 
        onReschedule={handleReschedule}
        onViewAllAppointments={handleViewAllAppointments}
      />

      <ServicesSection />

      <ReviewsSection />

      <EmergencyContact 
        onEmergencyCall={handleEmergencyCall}
        chatLoading={chatLoading}
      />
    </div>
  );
};

export default HomePage;
