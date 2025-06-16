
import React from "react";
import { toastInfo } from "@/components/ui/custom-toast";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/Home/HeroSection";
import { QuickActionsSection } from "@/components/Home/QuickActionsSection";
import { ServicesOverviewSection } from "@/components/Home/ServicesOverviewSection";
import { CTASection } from "@/components/Home/CTASection";

const Index = () => {
  const navigate = useNavigate();

  const handleEmergencyCall = () => {
    toastInfo("Emergência", "Conectando você com atendimento de emergência...");
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, "_blank");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background w-full">
      <div className="w-full px-4 py-8 space-y-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Actions */}
        <QuickActionsSection 
          onNavigate={handleNavigation}
          onEmergencyCall={handleEmergencyCall}
        />

        {/* Services Overview */}
        <ServicesOverviewSection onNavigate={handleNavigation} />

        {/* CTA Section */}
        <CTASection 
          onNavigate={handleNavigation}
          onWhatsAppContact={handleWhatsAppContact}
        />
      </div>
    </div>
  );
};

export default Index;
