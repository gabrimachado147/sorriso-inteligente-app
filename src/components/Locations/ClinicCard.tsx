
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { animations } from "@/lib/animations";
import { MapPin, Phone, MessageSquare, Navigation, Clock, Users } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
  coordinates: { lat: number; lng: number };
  available: boolean;
  services: string[];
  workingHours: string;
}

interface Service {
  id: string;
  name: string;
}

interface ClinicCardProps {
  clinic: Clinic;
  index: number;
  availableServices: Service[];
  onCall: (phone: string, clinicName: string) => void;
  onWhatsApp: (clinicName: string) => void;
  onRoute: (address: string, city: string, state: string, clinicName: string) => void;
  onSchedule: (clinicName: string) => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  clinic,
  index,
  availableServices,
  onCall,
  onWhatsApp,
  onRoute,
  onSchedule
}) => {
  return (
    <Card 
      className={`${animations.fadeIn} ${animations.cardHover} transition-all duration-300`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Imagem da Unidade */}
          <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <span className="text-sm font-medium text-primary">Senhor Sorriso</span>
            </div>
          </div>

          {/* Informações da Unidade */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{clinic.name}</h3>
                <p className="text-gray-600">{clinic.address}</p>
                <p className="text-sm text-gray-500">{clinic.city}, {clinic.state}</p>
              </div>
              
              <div className="flex flex-col items-start sm:items-end gap-2">
                <Badge 
                  variant={clinic.available ? "default" : "secondary"}
                  className={clinic.available ? "bg-green-100 text-green-800" : ""}
                >
                  {clinic.available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{clinic.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span>(31) 97114-7487</span>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{clinic.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Equipe especializada</span>
              </div>
            </div>

            {/* Serviços Disponíveis */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Serviços disponíveis:</h4>
              <div className="flex flex-wrap gap-2">
                {clinic.services.map((serviceId) => {
                  const service = availableServices.find(s => s.id === serviceId);
                  return service ? (
                    <Badge key={serviceId} variant="outline" className="text-xs">
                      {service.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className={animations.buttonHover}
                onClick={() => onCall(clinic.phone, clinic.name)}
              >
                <Phone className="h-4 w-4 mr-1" />
                Ligar
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className={`bg-green-50 border-green-200 text-green-700 hover:bg-green-100 ${animations.buttonHover}`}
                onClick={() => onWhatsApp(clinic.name)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className={animations.buttonHover}
                onClick={() => onRoute(clinic.address, clinic.city, clinic.state, clinic.name)}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Como Chegar
              </Button>
              
              <Button
                size="sm"
                className={`ml-auto ${animations.buttonHover}`}
                onClick={() => onSchedule(clinic.name)}
              >
                Agendar Consulta
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
