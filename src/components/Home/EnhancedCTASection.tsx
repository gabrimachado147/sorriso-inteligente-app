
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, Calendar, MessageCircle, Shield, Sparkles } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useContactActions } from '@/hooks/useContactActions';

export const EnhancedCTASection: React.FC = () => {
  const { handleScheduleNavigation } = useHomeNavigation();
  const { handleWhatsAppContact } = useContactActions();

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Card */}
        <Card className={`bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-2xl mb-16 ${animations.scaleIn}`}>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Oferta Especial - Avaliação Gratuita
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Transformar Seu Sorriso?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Agende sua avaliação gratuita hoje mesmo e descubra como podemos 
              tornar seu sorriso mais saudável, bonito e confiante
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-4 w-full sm:w-auto shadow-lg"
                onClick={handleScheduleNavigation}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Avaliação Gratuita
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 w-full sm:w-auto"
                onClick={() => handleWhatsAppContact()}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Resposta em até 1 hora</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>4.9★ de satisfação</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-300" />
                <span>100% Seguro e Confiável</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: 'Agendamento Simples',
              description: 'Marque sua consulta em poucos cliques, 24 horas por dia',
              color: 'bg-blue-500'
            },
            {
              icon: Star,
              title: 'Profissionais Qualificados',
              description: 'Equipe especializada com mais de 15 anos de experiência',
              color: 'bg-purple-500'
            },
            {
              icon: Heart,
              title: 'Atendimento Humanizado',
              description: 'Cuidado personalizado para cada paciente e família',
              color: 'bg-pink-500'
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title}
                className={`text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md ${animations.fadeInUp}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
