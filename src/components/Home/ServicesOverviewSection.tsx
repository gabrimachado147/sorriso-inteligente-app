
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
  return (
    <div className={`mobile-section ${animations.slideInRight}`}>
      <div className="mobile-section-header text-center">
        <h2 className="mobile-title md:text-3xl text-primary">Nossos Serviços</h2>
        <p className="mobile-text md:text-base text-muted-foreground">Tratamentos completos para toda a família</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4">
        {availableServices.map((service, index) => (
          <Card key={service.id} className={`mobile-card ${animations.cardHover} h-full cursor-pointer relative`}
                onClick={() => onNavigate('/schedule')}>
            <CardHeader className="mobile-card-header text-center">
              <div className="mx-auto mb-3 md:mb-3 text-primary">
                {React.cloneElement(service.icon, { 
                  className: "h-7 w-7 md:h-6 md:w-6" 
                })}
              </div>
              <CardTitle className="text-sm md:text-base leading-tight">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content text-center mt-auto">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mobile-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('/schedule');
                }}
              >
                Agendar
              </Button>
            </CardContent>
            
            {/* Badge para serviços populares */}
            {['avaliacao-gratuita', 'limpeza-dental', 'ortodontia-consulta', 'clareamento'].includes(service.id) && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-orange-500 text-white text-xs px-2 py-1 md:px-2 md:py-1"
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
