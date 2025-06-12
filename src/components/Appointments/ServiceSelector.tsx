
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { 
  Stethoscope, 
  Search, 
  Sparkles, 
  Wrench, 
  Smile, 
  Settings, 
  Shield, 
  Zap, 
  Baby, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  popular?: boolean;
  emergency?: boolean;
}

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
  filteredServices?: Service[];
}

const defaultServices: Service[] = [
  { 
    id: 'avaliacao-gratuita', 
    name: 'Avaliação Gratuita', 
    icon: <Search className="h-6 w-6" />, 
    popular: true 
  },
  { 
    id: 'limpeza', 
    name: 'Limpeza Dental', 
    icon: <Sparkles className="h-6 w-6" />, 
    popular: true 
  },
  { 
    id: 'restauracao', 
    name: 'Restauração', 
    icon: <Wrench className="h-6 w-6" /> 
  },
  { 
    id: 'ortodontia', 
    name: 'Ortodontia', 
    icon: <Smile className="h-6 w-6" />, 
    popular: true 
  },
  { 
    id: 'implantodontia', 
    name: 'Implantodontia', 
    icon: <Settings className="h-6 w-6" /> 
  },
  { 
    id: 'estetica-dental', 
    name: 'Estética Dental', 
    icon: <Sparkles className="h-6 w-6" />, 
    popular: true 
  },
  { 
    id: 'proteses-fixas', 
    name: 'Próteses Fixas', 
    icon: <Shield className="h-6 w-6" /> 
  },
  { 
    id: 'endodontia', 
    name: 'Endodontia', 
    icon: <Stethoscope className="h-6 w-6" /> 
  },
  { 
    id: 'odontopediatria', 
    name: 'Odontopediatria', 
    icon: <Baby className="h-6 w-6" /> 
  },
  { 
    id: 'periodontia', 
    name: 'Periodontia', 
    icon: <Heart className="h-6 w-6" /> 
  },
  { 
    id: 'urgencia', 
    name: 'Atendimento de Urgência', 
    icon: <AlertTriangle className="h-6 w-6" />, 
    emergency: true,
    popular: true 
  }
];

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceSelect,
  filteredServices
}) => {
  const services = filteredServices || defaultServices;

  return (
    <Card className={`${animations.fadeIn} ${animations.cardHover}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Serviços Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="relative">
              <Button
                variant={selectedService === service.id ? "default" : "outline"}
                className={`h-auto p-4 w-full ${animations.buttonHover} ${
                  selectedService === service.id ? animations.scaleIn : ''
                } ${service.emergency ? 'border-red-200 hover:border-red-300' : ''}`}
                onClick={() => onServiceSelect(service.id)}
              >
                <div className="text-center space-y-2">
                  <div className={`mx-auto ${
                    service.emergency ? 'text-red-600' : 
                    selectedService === service.id ? 'text-white' : 'text-primary'
                  }`}>
                    {service.icon}
                  </div>
                  <p className="font-medium text-sm">{service.name}</p>
                </div>
              </Button>
              
              {service.popular && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1"
                >
                  Popular
                </Badge>
              )}
              
              {service.emergency && (
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
