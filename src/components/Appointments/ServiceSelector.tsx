
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { animations } from '@/lib/animations';

interface Service {
  id: string;
  name: string;
}

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
  filteredServices: Service[];
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceSelect,
  filteredServices
}) => {
  return (
    <Card className={`${animations.fadeIn} ${animations.cardHover}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Tipo de Serviço
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <Button
              key={service.id}
              variant={selectedService === service.id ? "default" : "outline"}
              className={`h-auto p-4 ${animations.buttonHover} ${
                selectedService === service.id ? animations.scaleIn : ''
              }`}
              onClick={() => onServiceSelect(service.id)}
            >
              <div className="text-center">
                <Stethoscope className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">{service.name}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
