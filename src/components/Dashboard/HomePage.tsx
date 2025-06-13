import React from 'react';
import { HeroSection } from './HeroSection';
import QuickActions from './QuickActions';
import ServicesGrid from './ServicesGrid';
import { UnitsSection } from './UnitsSection';
import { AppointmentsSection } from './AppointmentsSection';
import { ReviewsSection } from './ReviewsSection';

const HomePage = () => {
  const handleScheduleClick = () => {
    window.location.href = '/schedule';
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReschedule = () => {
    window.location.href = '/schedule';
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAllAppointments = () => {
    window.location.href = '/appointments';
  };

  const handleViewUnits = () => {
    window.location.href = '/clinics';
  };

  const handleScheduleClinic = (clinic: string, phone: string) => {
    window.location.href = '/schedule';
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <HeroSection onScheduleClick={handleScheduleClick} />
      <QuickActions onScheduleClick={handleScheduleClick} />
      <ServicesGrid onScheduleClick={handleScheduleClick} />
      <UnitsSection 
        onViewUnits={handleViewUnits}
        onScheduleClinic={handleScheduleClinic}
      />
      <AppointmentsSection 
        onReschedule={handleReschedule}
        onViewAllAppointments={handleViewAllAppointments}
      />
      <ReviewsSection />
    </div>
  );
};

export default HomePage;
