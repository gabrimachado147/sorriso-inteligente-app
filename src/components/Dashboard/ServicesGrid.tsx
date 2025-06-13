
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';

interface ServicesGridProps {
  onServiceSelect: (service: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onServiceSelect }) => {
  const services = [
    { name: 'Avaliação Gratuita', icon: '🔍', popular: true },
    { name: 'Limpeza Dental', icon: '🦷', popular: true },
    { name: 'Restauração', icon: '🔧', popular: false },
    { name: 'Ortodontia', icon: '😬', popular: true },
    { name: 'Implantodontia', icon: '⚙️', popular: false },
    { name: 'Estética Dental', icon: '✨', popular: true },
    { name: 'Próteses Fixas', icon: '🔩', popular: false },
    { name: 'Endodontia', icon: '🩺', popular: false },
    { name: 'Odontopediatria', icon: '👶', popular: false },
    { name: 'Periodontia', icon: '🦷', popular: false },
    { name: 'Urgência 24h', icon: '🚨', popular: true },
  ];

  return (
    <Card className={animations.fadeIn}>
      <CardHeader>
        <CardTitle>Nossos Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {services.map((service, index) => (
            <Card 
              key={service.name} 
              className={`relative hover:shadow-md transition-shadow cursor-pointer ${animations.cardHover} ${animations.scaleIn}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onServiceSelect(service.name)}
            >
              {service.popular && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{service.icon}</div>
                <p className="text-sm font-medium">{service.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
