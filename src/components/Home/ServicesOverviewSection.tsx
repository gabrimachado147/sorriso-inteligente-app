
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { availableServices } from '@/components/Appointments/constants/services';

interface ServicesOverviewSectionProps {
  onNavigate: (path: string) => void;
}

export const ServicesOverviewSection: React.FC<ServicesOverviewSectionProps> = ({ onNavigate }) => {
  const popularServices = ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental'];
  const displayServices = availableServices.slice(0, 8); // Mostrar apenas 8 serviços principais

  return (
    <div className={`space-y-8 ${animations.slideInRight}`}>
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 mobile-text-xl">
          Nossos Serviços
        </h2>
        <p className="text-muted-foreground text-lg mobile-text-base max-w-2xl mx-auto">
          Tratamentos completos para toda a família com tecnologia avançada
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayServices.map((service, index) => (
          <Card 
            key={service.id} 
            className={`
              ${animations.cardHover} h-full cursor-pointer relative
              mobile-card-spacing mobile-touch-target
              hover:shadow-lg transition-all duration-300
              bg-white border border-border
            `}
            onClick={() => onNavigate('/schedule')}
          >
            <CardHeader className="text-center pb-3 p-4">
              <div className="mx-auto mb-3 text-primary bg-primary/10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center">
                {React.cloneElement(service.icon as React.ReactElement, { 
                  className: "h-6 w-6 md:h-7 md:w-7" 
                })}
              </div>
              <CardTitle className="text-sm md:text-base mobile-text-xs font-semibold leading-tight">
                {service.name}
              </CardTitle>
              {service.price === 'Gratuito' && (
                <p className="text-xs text-green-600 font-medium">Gratuito</p>
              )}
            </CardHeader>
            <CardContent className="text-center pt-0 p-4">
              <button 
                className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg font-medium mobile-touch-target hover:bg-primary/90 transition-colors text-sm mobile-text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('/schedule');
                }}
              >
                Agendar
              </button>
            </CardContent>
            
            {popularServices.includes(service.id) && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 mobile-text-xs"
              >
                Popular
              </Badge>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={() => onNavigate('/schedule')}
          className="px-8 py-3 border-2 border-primary text-primary rounded-xl font-semibold mobile-touch-target hover:bg-primary hover:text-primary-foreground transition-colors mobile-text-base"
        >
          Ver todos os serviços
        </button>
      </div>
    </div>
  );
};
