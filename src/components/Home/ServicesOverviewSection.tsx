
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
    <div className={`space-y-6 ${animations.slideInRight}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Nossos Serviços</h2>
        <p className="text-muted-foreground">Tratamentos completos para toda a família</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableServices.map((service, index) => (
          <Card key={service.id} className={`${animations.cardHover} h-full cursor-pointer relative`}
                onClick={() => onNavigate('/appointments')}>
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3 text-primary">
                {service.icon}
              </div>
              <CardTitle className="text-base">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('/appointments');
                }}
              >
                Agendar
              </Button>
            </CardContent>
            
            {/* Badge para serviços populares */}
            {['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental', 'urgencia'].includes(service.id) && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1"
              >
                Popular
              </Badge>
            )}
            
            {/* Badge para urgência */}
            {service.id === 'urgencia' && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1"
              >
                24h
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
