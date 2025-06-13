
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations, getStaggerStyle } from '@/lib/animations';
import { ServiceCardSkeleton } from '@/components/ui/enhanced-skeleton';
import { availableServices } from '@/components/Appointments/constants/services';

interface ServicesGridProps {
  onServiceSelect: (service: string) => void;
  loading?: boolean;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onServiceSelect, loading = false }) => {
  if (loading) {
    return (
      <Card className={animations.fadeIn}>
        <CardHeader className="text-center">
          <CardTitle>Nossos Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={animations.fadeIn}>
      <CardHeader className="text-center">
        <CardTitle>Nossos Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {availableServices.map((service, index) => (
            <Card 
              key={service.id} 
              className={`relative cursor-pointer ${animations.serviceCardHover} ${animations.scaleIn} hover:shadow-md transition-all duration-200 min-h-[120px]`}
              style={getStaggerStyle(index)}
              onClick={() => onServiceSelect(service.name)}
            >
              {['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental', 'clareamento'].includes(service.id) && (
                <div className={`absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full ${animations.fadeInFast}`}>
                  Popular
                </div>
              )}
              <CardContent className="p-3 text-center flex flex-col items-center justify-center h-full">
                <div className={`text-primary mb-3 ${animations.iconHover} flex justify-center`}>
                  {service.icon}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-tight">{service.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
