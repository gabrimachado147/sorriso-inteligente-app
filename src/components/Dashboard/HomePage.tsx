
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from '@/components/Home/HeroSection';
import { QuickActionsSection } from '@/components/Home/QuickActionsSection';
import { ServicesOverviewSection } from '@/components/Home/ServicesOverviewSection';
import { CTASection } from '@/components/Home/CTASection';
import { animations } from '@/lib/animations';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleEmergencyCall = () => {
    window.open('tel:+5511999999999', '_self');
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary/5 to-background ${animations.pageEnter}`}>
      <div className="container mx-auto px-4 py-8 space-y-16">
        <HeroSection />
        
        <QuickActionsSection 
          onNavigate={handleNavigate}
          onEmergencyCall={handleEmergencyCall}
        />
        
        <ServicesOverviewSection onNavigate={handleNavigate} />
        
        <CTASection 
          onNavigate={handleNavigate}
          onWhatsAppContact={handleWhatsAppContact}
        />
      </div>
    </div>
  );
};

export default HomePage;
