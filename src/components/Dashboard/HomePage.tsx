
import React from 'react';
import { animations } from '@/lib/animations';
import { useHomePageNavigation } from '@/hooks/useHomePageNavigation';
import { useDashboardState } from '@/hooks/useDashboardState';
import { HeroWelcomeSection } from './HeroWelcomeSection';
import { QuickActionsGrid } from './QuickActionsGrid';
import { UnitsSection } from './UnitsSection';
import { AppointmentsSection } from './AppointmentsSection';
import { ServicesSection } from './ServicesSection';
import { ReviewsSection } from './ReviewsSection';
import { EmergencyContact } from './EmergencyContact';

const HomePage: React.FC = () => {
  const {
    handleViewUnits,
    handleReschedule,
    handleViewAllAppointments,
    handleScheduleClinic,
    handleQuickAction,
    handleEmergencyCall
  } = useHomePageNavigation();

  const {
    schedulingLoading,
    chatLoading
  } = useDashboardState();

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
