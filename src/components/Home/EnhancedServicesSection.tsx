
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { availableServices } from '@/components/Appointments/constants/services';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { ArrowRight, Star } from 'lucide-react';

export const EnhancedServicesSection: React.FC = () => {
  const { handleScheduleNavigation } = useHomeNavigation();
  const popularServices = ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental'];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Star className="h-4 w-4 mr-2" />
            Nossos Tratamentos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tecnologia Avançada para o Seu Sorriso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de tratamentos odontológicos com 
            equipamentos de última geração e profissionais especializados
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {availableServices.map((service, index) => (
            <Card 
              key={service.id} 
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg ${animations.fadeInUp}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  {React.cloneElement(service.icon as React.ReactElement, { 
                    className: "h-8 w-8 text-primary" 
                  })}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{service.price}</p>
                {popularServices.includes(service.id) && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 mt-2">
                    Popular
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  size="lg" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                  variant="outline"
                  onClick={handleScheduleNavigation}
                >
                  Agendar Consulta
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Não encontrou o que procura?
              </h3>
              <p className="text-gray-600 mb-6">
                Nossa equipe especializada pode orientar você sobre o melhor tratamento
              </p>
              <Button 
                size="lg" 
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="bg-primary hover:bg-primary/90"
              >
                Falar com Especialista
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
