
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from '@/components/Home/HeroSection';
import { QuickActionsSection } from '@/components/Home/QuickActionsSection';
import { ServicesOverviewSection } from '@/components/Home/ServicesOverviewSection';
import { CTASection } from '@/components/Home/CTASection';
import { animations } from '@/lib/animations';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="min-h-screen bg-background mobile-scroll">
      {/* Hero Section */}
      <section className={`py-8 md:py-16 mobile-container ${animations.fadeIn}`}>
        <HeroSection />
      </section>

      {/* Quick Actions Section */}
      <section className={`py-6 md:py-12 mobile-container ${animations.slideInUp}`}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 mobile-text-xl">
            Ações Rápidas
          </h2>
          <p className="text-muted-foreground mobile-text-base">
            Acesse rapidamente nossos principais serviços
          </p>
        </div>
        <QuickActionsSection 
          onNavigate={handleNavigate}
          onEmergencyCall={handleEmergencyCall}
        />
      </section>

      {/* Clinics Section */}
      <section className={`py-8 md:py-16 bg-muted/30 ${animations.fadeIn}`}>
        <div className="mobile-container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 mobile-text-xl">
              Nossas Unidades
            </h2>
            <p className="text-lg text-muted-foreground mobile-text-base max-w-2xl mx-auto">
              Encontre a unidade mais próxima de você
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border mobile-card-spacing mobile-touch-target hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 mobile-text-lg">Campo Belo - MG</h3>
              <p className="text-muted-foreground mb-4 mobile-text-base">Av. Afonso Pena, 151, Centro</p>
              <button 
                onClick={() => handleNavigate('/schedule')}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold mobile-touch-target hover:bg-primary/90 transition-colors mobile-text-base"
              >
                Agendar Consulta
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border mobile-card-spacing mobile-touch-target hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 mobile-text-lg">Formiga - MG</h3>
              <p className="text-muted-foreground mb-4 mobile-text-base">R. Barão de Piumhy, 198, Centro</p>
              <button 
                onClick={() => handleNavigate('/schedule')}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold mobile-touch-target hover:bg-primary/90 transition-colors mobile-text-base"
              >
                Agendar Consulta
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => handleNavigate('/clinics')}
              className="px-8 py-3 border-2 border-primary text-primary rounded-xl font-semibold mobile-touch-target hover:bg-primary hover:text-primary-foreground transition-colors mobile-text-base"
            >
              Ver todas as unidades
            </button>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className={`py-8 md:py-16 mobile-container ${animations.slideInRight}`}>
        <ServicesOverviewSection onNavigate={handleNavigate} />
      </section>

      {/* Login Section for Non-authenticated Users */}
      {!user && (
        <section className={`py-8 md:py-12 bg-muted/30 ${animations.fadeIn}`}>
          <div className="mobile-container text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md mx-auto mobile-card-spacing">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-2h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 mobile-text-lg">Área do Paciente</h3>
              <p className="text-muted-foreground mb-6 mobile-text-base">
                Acesse sua conta para ver consultas e histórico
              </p>
              <button 
                onClick={() => handleNavigate('/auth')}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold mobile-touch-target hover:bg-primary/90 transition-colors mobile-text-base"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-8 md:py-16 mobile-container ${animations.scaleIn}`}>
        <CTASection 
          onNavigate={handleNavigate}
          onWhatsAppContact={handleWhatsAppContact}
        />
      </section>

      {/* Emergency Contact Section */}
      <section className={`py-6 bg-red-50 border-t-4 border-red-500 ${animations.slideInUp}`}>
        <div className="mobile-container">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 max-w-2xl mx-auto mobile-card-spacing">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-red-600 mb-2 mobile-text-lg flex items-center justify-center sm:justify-start gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Urgência Dental
                </h3>
                <p className="text-red-700 mobile-text-base">Atendimento 24h para emergências</p>
              </div>
              <button 
                onClick={handleEmergencyCall}
                className="w-full sm:w-auto bg-red-600 text-white py-3 px-8 rounded-xl font-semibold mobile-touch-target hover:bg-red-700 transition-colors mobile-text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contatar Agora
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
