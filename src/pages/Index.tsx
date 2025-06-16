
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/Home/HeroSection';
import { QuickActionsSection } from '@/components/Home/QuickActionsSection';
import { ServicesOverviewSection } from '@/components/Home/ServicesOverviewSection';
import { CTASection } from '@/components/Home/CTASection';

const Index = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá! Gostaria de agendar uma consulta no Senhor Sorriso.");
    window.open(`https://wa.me/5535999999999?text=${message}`, '_blank');
  };

  const handleEmergencyCall = () => {
    window.open('tel:+5535999999999', '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Actions */}
        <QuickActionsSection onNavigate={navigate} onEmergencyCall={handleEmergencyCall} />

        {/* Services Overview */}
        <ServicesOverviewSection onNavigate={navigate} />

        {/* Call to Action */}
        <CTASection onNavigate={navigate} onWhatsAppContact={handleWhatsAppContact} />
      </div>
    </div>
  );
};

export default Index;
