
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star } from 'lucide-react';
import { animations } from '@/lib/animations';

interface ServicesGridProps {
  onScheduleClick: () => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ onScheduleClick }) => {
  const services = [
    {
      name: 'Avaliação Odontológica',
      description: 'Consulta completa com diagnóstico detalhado',
      duration: '30 min',
      price: 'Gratuito',
      popular: true,
      rating: 4.9
    },
    {
      name: 'Limpeza Dental',
      description: 'Profilaxia profissional e orientações',
      duration: '45 min',
      price: 'R$ 150',
      popular: false,
      rating: 4.8
    },
    {
      name: 'Ortodontia',
      description: 'Aparelhos ortodônticos e acompanhamento',
      duration: '60 min',
      price: 'Consultar',
      popular: true,
      rating: 4.9
    },
    {
      name: 'Implante Dentário',
      description: 'Reabilitação com implantes de titânio',
      duration: '90 min',
      price: 'Consultar',
      popular: false,
      rating: 5.0
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma ampla gama de tratamentos odontológicos com tecnologia de ponta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.name}
              className={`transition-all duration-300 hover:shadow-lg hover:scale-105 relative ${animations.fadeIn}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.popular && (
                <Badge className="absolute top-3 right-3 bg-primary">
                  Popular
                </Badge>
              )}
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {service.rating}
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-primary mb-4">
                    {service.price}
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${animations.buttonHover}`}
                  onClick={onScheduleClick}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
