
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Shield, Sparkles } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useUserBehaviorTracking } from '@/hooks/useUserBehaviorTracking';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';
import { OptimizedImage } from '@/components/ui/optimized-image';

export const EnhancedHeroSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { handleScheduleNavigation } = useHomeNavigation();
  const { trackClick } = useUserBehaviorTracking();

  const handleScheduleClick = () => {
    trackClick('hero_schedule_button', { section: 'hero', user_authenticated: isAuthenticated });
    handleScheduleNavigation();
  };

  const handleWhatsAppClick = () => {
    trackClick('hero_whatsapp_button', { section: 'hero' });
    window.open('https://wa.me/5511999999999', '_blank');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6 overflow-hidden">
      {/* Background decoration com performance otimizada */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Logo otimizado com lazy loading */}
        <div className="text-center mb-8">
          <InteractiveFeedback feedbackType="glow" className={`flex justify-center mb-6 ${animations.scaleInBounce}`}>
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-xl">
              <OptimizedImage 
                src="/lovable-uploads/239d166e-ad2a-4b8e-9fef-073da7ed8b39.png" 
                alt="Senhor Sorriso Odontologia - Logo Oficial" 
                className="w-full h-full object-contain p-1"
                priority={true}
              />
            </div>
          </InteractiveFeedback>
          
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Tecnologia de Ponta em Odontologia
          </Badge>
        </div>

        <div className="text-center mb-16">
          {isAuthenticated && user ? (
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${animations.fadeIn}`}>
              Bem-vindo de volta, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
            </h1>
          ) : (
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${animations.fadeIn}`}>
              Seu Sorriso Inteligente Começa Aqui
            </h1>
          )}
          
          <p className={`text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto ${animations.fadeIn}`}
             style={{ animationDelay: '200ms' }}>
            Cuidado odontológico de excelência com tecnologia avançada, 
            atendimento humanizado e a praticidade que você merece
          </p>
          
          {/* CTAs principais otimizados com feedback visual */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 ${animations.fadeIn}`}
               style={{ animationDelay: '400ms' }}>
            <InteractiveFeedback feedbackType="scale">
              <Button 
                onClick={handleScheduleClick}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Avaliação Gratuita
              </Button>
            </InteractiveFeedback>
            
            <InteractiveFeedback feedbackType="glow">
              <Button 
                variant="outline"
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-full font-semibold w-full sm:w-auto transition-all duration-300"
                onClick={handleWhatsAppClick}
              >
                Falar no WhatsApp
              </Button>
            </InteractiveFeedback>
          </div>

          {/* Trust indicators melhorados */}
          <div className={`flex flex-wrap justify-center items-center gap-6 text-blue-200 ${animations.fadeIn}`}
               style={{ animationDelay: '600ms' }}>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
              <span>4.9★ em avaliações</span>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Shield className="h-5 w-5 text-green-300" />
              <span>100% Seguro</span>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Calendar className="h-5 w-5 text-blue-300" />
              <span>Agendamento Online 24/7</span>
            </InteractiveFeedback>
          </div>
        </div>

        {/* Stats Grid com animações melhoradas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Star, label: 'Pacientes Satisfeitos', value: '10.000+', color: 'text-yellow-300' },
            { icon: Shield, label: 'Taxa de Sucesso', value: '98%', color: 'text-green-300' },
            { icon: Calendar, label: 'Anos de Experiência', value: '15+', color: 'text-blue-300' },
            { icon: Sparkles, label: 'Tratamentos Realizados', value: '25.000+', color: 'text-purple-300' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <InteractiveFeedback 
                key={stat.label}
                feedbackType="scale"
              >
                <Card 
                  className={`bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 ${animations.fadeIn}`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </CardContent>
                </Card>
              </InteractiveFeedback>
            );
          })}
        </div>
      </div>
    </section>
  );
};
