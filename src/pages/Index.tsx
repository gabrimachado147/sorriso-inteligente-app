
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
      <div className="w-full mobile-scroll">
        <div className="space-y-8 py-4">
          {/* Hero Section */}
          <section className="mobile-fade-in">
            <HeroSection />
          </section>

          {/* Quick Actions */}
          <section className="mobile-slide-up" style={{ animationDelay: '200ms' }}>
            <QuickActionsSection onNavigate={navigate} onEmergencyCall={handleEmergencyCall} />
          </section>

          {/* Services Overview */}
          <section className="mobile-slide-up" style={{ animationDelay: '400ms' }}>
            <ServicesOverviewSection onNavigate={navigate} />
          </section>

          {/* Call to Action */}
          <section className="mobile-scale-in" style={{ animationDelay: '600ms' }}>
            <CTASection onNavigate={navigate} onWhatsAppContact={handleWhatsAppContact} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
