
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
    <div className="w-full bg-gradient-to-br from-primary/5 to-background">
      <div className="w-full space-y-12 py-8">
        {/* Hero Section */}
        <div className="px-4 sm:px-6">
          <HeroSection />
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6">
          <QuickActionsSection 
            onNavigate={handleNavigation}
            onEmergencyCall={handleEmergencyCall}
          />
        </div>

        {/* Services Overview */}
        <div className="px-4 sm:px-6">
          <ServicesOverviewSection onNavigate={handleNavigation} />
        </div>

        {/* CTA Section */}
        <div className="px-4 sm:px-6">
          <CTASection 
            onNavigate={handleNavigation}
            onWhatsAppContact={handleWhatsAppContact}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
