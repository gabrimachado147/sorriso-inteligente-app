
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';
import { toastInfo } from '@/components/ui/custom-toast';
import { animations, getStaggerStyle } from '@/lib/animations';

interface QuickActionsSectionProps {
  onNavigate: (path: string) => void;
  onEmergencyCall: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ 
  onNavigate, 
  onEmergencyCall 
}) => {
  const actions = [
    {
      icon: Calendar,
      title: "Agendar",
      description: "Marque sua consulta rapidamente",
      buttonText: "Novo Agendamento",
      buttonVariant: "default" as const,
      path: "/schedule",
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: MessageCircle,
      title: "Chat",
      description: "Tire suas dúvidas conosco",
      buttonText: "Iniciar Chat",
      buttonVariant: "outline" as const,
      path: "/chat",
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: MapPin,
      title: "Unidades",
      description: "Encontre a unidade mais próxima",
      buttonText: "Ver Locais",
      buttonVariant: "outline" as const,
      path: "/clinics",
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: Phone,
      title: "Emergência",
      description: "",
      buttonText: "Contatar Agora",
      buttonVariant: "destructive" as const,
      path: "",
      borderColor: "border-red-200 hover:border-red-400",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isEmergency = action.title === "Emergência";
        
        return (
          <Card 
            key={action.title}
            className={`
              mobile-card
              ${animations.serviceCardHover} 
              ${action.borderColor} 
              ${action.bgColor}
              transition-all cursor-pointer flex flex-col h-full
              ${animations.fadeInUp}
            `}
            style={getStaggerStyle(index, 150)}
            onClick={() => isEmergency ? onEmergencyCall() : onNavigate(action.path)}
          >
            <CardHeader className="text-center pb-1 md:pb-2 flex-grow">
              <div className={`mx-auto mb-1 md:mb-3 ${animations.iconHover}`}>
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${isEmergency ? 'text-red-600' : 'text-primary'}`} />
              </div>
              <CardTitle className={`text-sm md:text-lg ${isEmergency ? 'text-red-600' : ''}`}>
                {action.title}
              </CardTitle>
              {action.description && (
                <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-3 hidden md:block">
                  {action.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="text-center pt-0 mt-auto p-2 md:p-6">
              <Button 
                variant={action.buttonVariant}
                className={`w-full text-xs md:text-sm mobile-button ${animations.buttonHover}`}
                onClick={(e) => {
                  e.stopPropagation();
                  isEmergency ? onEmergencyCall() : onNavigate(action.path);
                }}
              >
                <span className="hidden md:inline">{action.buttonText}</span>
                <span className="md:hidden">{action.title}</span>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
