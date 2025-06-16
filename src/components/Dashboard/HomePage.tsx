
import React from 'react';
import { toastSuccess, toastInfo } from '@/components/ui/custom-toast';
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

  const handleServiceSelect = (service: string) => {
    toastInfo('Serviço selecionado', `Você selecionou: ${service}`);
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
        toastInfo('Ação rápida', `Ação: ${action}`);
    }
  };

  const handleScheduleEvaluation = () => {
    toastSuccess('Agendamento', 'Avaliação gratuita agendada!');
  };

  const handleEmergencyCall = () => {
    navigate('/emergency');
  };

  const schedulingLoading = false;
  const chatLoading = false;

  return (
    <div className={`p-4 space-y-6 ${animations.pageEnter}`}>
      <HeroWelcomeSection 
        onScheduleEvaluation={handleScheduleEvaluation}
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

      <ServicesSection onServiceSelect={handleServiceSelect} />

      <ReviewsSection />

      <EmergencyContact 
        onEmergencyCall={handleEmergencyCall}
        chatLoading={chatLoading}
      />
    </div>
  );
};

export default HomePage;
