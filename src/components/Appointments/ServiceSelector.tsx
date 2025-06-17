
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { availableServices } from './constants/services';

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceSelect
}) => {
  const popularServices = ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental'];

  return (
    <Card className={`${animations.fadeIn} ${animations.cardHover} w-full`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableServices.map((service) => (
            <div key={service.id} className="relative">
              <Button
                variant={selectedService === service.id ? "default" : "outline"}
                className={`h-auto p-3 w-full mobile-touch-target ${animations.buttonHover} ${
                  selectedService === service.id ? animations.scaleIn : ''
                } ${service.category === 'urgencia' ? 'border-red-200 hover:border-red-300' : ''}`}
                onClick={() => onServiceSelect(service.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`${
                    service.category === 'urgencia' ? 'text-red-600' : 
                    selectedService === service.id ? 'text-white' : 'text-primary'
                  }`}>
                    {service.icon}
                  </div>
                  <div>
                    <p className="font-medium mobile-text-sm leading-tight">{service.name}</p>
                    {service.price === 'Gratuito' && (
                      <p className="text-xs text-muted-foreground mt-1">Gratuito</p>
                    )}
                  </div>
                </div>
              </Button>
              
              {popularServices.includes(service.id) && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1"
                >
                  Popular
                </Badge>
              )}
              
              {service.category === 'urgencia' && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1"
                >
                  Urgência
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
