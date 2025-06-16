
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/Home/HeroSection';
import { QuickActionsSection } from '@/components/Home/QuickActionsSection';
import { ServicesOverviewSection } from '@/components/Home/ServicesOverviewSection';
import { CTASection } from '@/components/Home/CTASection';
import { animations } from '@/lib/animations';

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEmergencyCall = () => {
    window.open('tel:+5515997123456', '_self');
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta na Senhor Sorriso.');
    window.open(`https://wa.me/5515997123456?text=${message}`, '_blank');
  };

  return (
    <div className={`min-h-screen bg-background w-full ${animations.pageEnter}`}>
      <div className="w-full space-y-16 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Actions Section */}
        <QuickActionsSection 
          onNavigate={handleNavigate}
          onEmergencyCall={handleEmergencyCall}
        />

        {/* Services Overview Section */}
        <ServicesOverviewSection onNavigate={handleNavigate} />

        {/* CTA Section */}
        <CTASection 
          onNavigate={handleNavigate}
          onWhatsAppContact={handleWhatsAppContact}
        />
      </div>
    </div>
  );
};

export default Index;
