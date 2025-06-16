
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/Home/HeroSection';
import { QuickActionsSection } from '@/components/Home/QuickActionsSection';
import { ServicesOverviewSection } from '@/components/Home/ServicesOverviewSection';
import { CTASection } from '@/components/Home/CTASection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { animations } from '@/lib/animations';

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

        {/* Staff Access Card - Positioned higher up */}
        <div className={`flex justify-center ${animations.slideInTop}`}>
          <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-lg mobile-card-spacing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-primary rounded-full p-3">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-primary mobile-text-xl">Acesso Funcionários</CardTitle>
              <p className="text-muted-foreground mobile-text-base">
                Selecione sua clínica e digite a senha para acessar os agendamentos
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="w-full text-lg font-semibold mobile-touch-target" 
                onClick={() => navigate('/appointments')}
              >
                Entrar
              </Button>
            </CardContent>
          </Card>
        </div>

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
