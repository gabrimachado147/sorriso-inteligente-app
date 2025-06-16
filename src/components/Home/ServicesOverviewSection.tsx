import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { availableServices } from '@/components/Appointments/constants/services';

interface ServicesOverviewSectionProps {
  onNavigate: (path: string) => void;
}

export const ServicesOverviewSection: React.FC<ServicesOverviewSectionProps> = ({ onNavigate }) => {
  const popularServices = ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental'];

  return (
    <div className={`space-y-8 px-4 ${animations.slideInRight}`}>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-4 mobile-text-xl">Nossos Serviços</h2>
        <p className="text-muted-foreground text-lg mobile-text-base">Tratamentos completos para toda a família</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {availableServices.map((service, index) => (
          <Card key={service.id} className={`${animations.cardHover} h-full cursor-pointer relative mobile-card-spacing mobile-touch-target`}
                onClick={() => onNavigate('/schedule')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 text-primary">
                {React.isValidElement(service.icon)
                  ? React.cloneElement(service.icon, { className: "h-10 w-10" })
                  : null}
              </div>
              <CardTitle className="text-lg mobile-text-base">{service.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{service.price}</p>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full mobile-touch-target text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('/schedule');
                }}
              >
                Agendar
              </Button>
            </CardContent>
            
            {popularServices.includes(service.id) && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm px-3 py-1"
              >
                Popular
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
