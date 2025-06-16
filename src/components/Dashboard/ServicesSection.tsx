
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { availableServices } from '@/components/Appointments/constants/services';
import { useNavigate } from 'react-router-dom';

export const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const popularServices = ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental'];

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/schedule?service=${serviceId}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Card className={animations.fadeIn}>
      <CardHeader>
        <CardTitle>Nossos Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableServices.map((service, index) => (
            <Card 
              key={service.name} 
              className={`relative hover:shadow-md transition-shadow cursor-pointer ${animations.cardHover} ${animations.scaleIn}`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleServiceSelect(service.id)}
            >
              {popularServices.includes(service.id) && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <CardContent className="p-3 text-center">
                <div className="text-primary mb-2 flex justify-center">{service.icon}</div>
                <p className="text-sm font-medium">{service.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
