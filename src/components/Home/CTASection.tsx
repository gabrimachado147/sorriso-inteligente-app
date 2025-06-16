
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Star, CheckCircle } from 'lucide-react';
import { animations } from '@/lib/animations';

interface CTASectionProps {
  onNavigate: (path: string) => void;
  onWhatsAppContact: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate, onWhatsAppContact }) => {
  const benefits = [
    { icon: CheckCircle, text: 'Avaliação Gratuita' },
    { icon: Clock, text: 'Agendamento Rápido' },
    { icon: Star, text: 'Profissionais Qualificados' },
    { icon: Heart, text: 'Atendimento Humanizado' }
  ];

  return (
    <div className={`text-center space-y-8 ${animations.scaleIn}`}>
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mobile-card-spacing overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <CardHeader className="relative z-10 pb-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl text-primary mobile-text-xl font-bold">
            Pronto para cuidar do seu sorriso?
          </CardTitle>
          <CardDescription className="text-lg md:text-xl mobile-text-base text-muted-foreground max-w-2xl mx-auto">
            Agende sua avaliação gratuita e dê o primeiro passo para um sorriso mais saudável e bonito.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-8">
          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mobile-text-xs font-medium">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button 
              onClick={() => onNavigate('/schedule')}
              className="w-full sm:w-auto bg-primary text-primary-foreground py-4 px-8 rounded-xl font-semibold mobile-touch-target hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl mobile-text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6" />
              </svg>
              Agendar Avaliação Gratuita
            </button>
            
            <button 
              onClick={onWhatsAppContact}
              className="w-full sm:w-auto bg-green-600 text-white py-4 px-8 rounded-xl font-semibold mobile-touch-target hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mobile-text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
              </svg>
              WhatsApp
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mobile-text-xs">
            ✓ Sem compromisso • ✓ Atendimento em 5 cidades • ✓ Avaliação 100% gratuita
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
