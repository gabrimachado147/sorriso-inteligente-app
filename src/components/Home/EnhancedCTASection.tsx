
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, Calendar, MessageCircle, Shield, Sparkles, Zap, Award } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useContactActions } from '@/hooks/useContactActions';
import { useUserBehaviorTracking } from '@/hooks/useUserBehaviorTracking';
import { EnhancedCTA } from '@/components/ui/enhanced-cta';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';

export const EnhancedCTASection: React.FC = () => {
  const { handleScheduleNavigation } = useHomeNavigation();
  const { handleWhatsAppContact } = useContactActions();
  const { trackClick } = useUserBehaviorTracking();

  const handleScheduleCTA = () => {
    trackClick('cta_schedule_main', { section: 'cta_section', type: 'primary' });
    handleScheduleNavigation();
  };

  const handleWhatsAppCTA = () => {
    trackClick('cta_whatsapp_main', { section: 'cta_section', type: 'secondary' });
    handleWhatsAppContact();
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* CTA Principal Melhorado */}
        <div className={`mb-16 ${animations.scaleIn}`}>
          <EnhancedCTA
            title="Pronto para Transformar Seu Sorriso?"
            description="Agende sua avaliação gratuita hoje mesmo e descubra como podemos tornar seu sorriso mais saudável, bonito e confiante"
            buttonText="Agendar Avaliação Gratuita"
            onClick={handleScheduleCTA}
            icon={Heart}
            variant="primary"
            badge="💫 Oferta Especial - Avaliação Gratuita"
            className="shadow-2xl"
          />
        </div>

        {/* CTAs Secundários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <InteractiveFeedback feedbackType="scale">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Atendimento Express</h3>
                <p className="text-gray-600 mb-6">
                  Urgência odontológica? Fale conosco no WhatsApp e receba atendimento prioritário
                </p>
                <Button 
                  onClick={handleWhatsAppCTA}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Urgência
                </Button>
              </CardContent>
            </Card>
          </InteractiveFeedback>

          <InteractiveFeedback feedbackType="scale">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Planos Especiais</h3>
                <p className="text-gray-600 mb-6">
                  Conheça nossos planos personalizados e condições especiais de pagamento
                </p>
                <Button 
                  onClick={() => {
                    trackClick('cta_plans', { section: 'cta_section' });
                    // Navegar para página de planos
                  }}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                  size="lg"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Ver Planos
                </Button>
              </CardContent>
            </Card>
          </InteractiveFeedback>
        </div>

        {/* Benefícios Grid Melhorado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: 'Agendamento Inteligente',
              description: 'Sistema online 24/7 com confirmação automática e lembretes personalizados',
              color: 'bg-blue-500',
              highlight: 'Disponível sempre'
            },
            {
              icon: Star,
              title: 'Profissionais Premium',
              description: 'Equipe especializada com certificações internacionais e 15+ anos de experiência',
              color: 'bg-purple-500',
              highlight: 'Excelência comprovada'
            },
            {
              icon: Heart,
              title: 'Cuidado Humanizado',
              description: 'Atendimento personalizado com foco no bem-estar e conforto de cada paciente',
              color: 'bg-pink-500',
              highlight: 'Cuidado pessoal'
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <InteractiveFeedback 
                key={benefit.title}
                feedbackType="glow"
              >
                <Card 
                  className={`text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md ${animations.fadeInUp}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8">
                    <Badge className="mb-4 bg-gray-100 text-gray-700">
                      {benefit.highlight}
                    </Badge>
                    <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </InteractiveFeedback>
            );
          })}
        </div>

        {/* Trust Indicators Melhorados */}
        <div className={`mt-16 text-center ${animations.fadeIn}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Por que escolher Senhor Sorriso?</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Resposta em até 1 hora</span>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">4.9★ de satisfação</span>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium">100% Seguro e Confiável</span>
            </InteractiveFeedback>
            <InteractiveFeedback feedbackType="ripple" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md">
              <Award className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Certificação Premium</span>
            </InteractiveFeedback>
          </div>
        </div>
      </div>
    </section>
  );
};
