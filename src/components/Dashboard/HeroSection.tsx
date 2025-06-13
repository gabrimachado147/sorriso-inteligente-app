
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';

interface HeroSectionProps {
  onScheduleClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScheduleClick }) => {
  return (
    <section className={`py-16 px-6 text-center ${animations.fadeIn}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Sorrisos que
            <span className="text-primary block">transformam vidas</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Cuidamos do seu sorriso com excelência, tecnologia de ponta e profissionais especializados.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className={`px-8 py-4 text-lg ${animations.buttonHover}`}
            onClick={onScheduleClick}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Agendar Consulta
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className={`px-8 py-4 text-lg ${animations.buttonHover}`}
            onClick={() => window.location.href = '/chat'}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com Assistente
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className={`text-center ${animations.slideInBottom}`}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Agendamento Online</h3>
            <p className="text-gray-600">Reserve sua consulta de forma rápida e prática</p>
          </div>

          <div className={`text-center ${animations.slideInBottom}`} style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Assistente Virtual</h3>
            <p className="text-gray-600">Tire suas dúvidas e receba orientações personalizadas</p>
          </div>

          <div className={`text-center ${animations.slideInBottom}`} style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Múltiplas Unidades</h3>
            <p className="text-gray-600">Encontre a clínica mais próxima de você</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
