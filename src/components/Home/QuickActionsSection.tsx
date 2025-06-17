
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';
import { animations, getStaggerStyle } from '@/lib/animations';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useContactActions } from '@/hooks/useContactActions';

export const QuickActionsSection: React.FC = () => {
  const { 
    handleScheduleNavigation,
    handleChatNavigation,
    handleClinicsNavigation
  } = useHomeNavigation();
  
  const { handleEmergencyCall } = useContactActions();

  const actions = [
    {
      icon: Calendar,
      title: "Agendar",
      description: "Marque sua consulta rapidamente",
      buttonText: "Novo Agendamento",
      buttonVariant: "default" as const,
      onClick: handleScheduleNavigation,
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: MessageCircle,
      title: "Chat",
      description: "Tire suas dúvidas conosco",
      buttonText: "Iniciar Chat",
      buttonVariant: "outline" as const,
      onClick: handleChatNavigation,
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: MapPin,
      title: "Unidades",
      description: "Encontre a unidade mais próxima",
      buttonText: "Ver Locais",
      buttonVariant: "outline" as const,
      onClick: handleClinicsNavigation,
      borderColor: "border-primary/20 hover:border-primary/40",
      bgColor: ""
    },
    {
      icon: Phone,
      title: "Emergência",
      description: "Contato para urgências",
      buttonText: "Contatar Agora",
      buttonVariant: "destructive" as const,
      onClick: handleEmergencyCall,
      borderColor: "border-red-200 hover:border-red-400",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isEmergency = action.title === "Emergência";
        
        return (
          <Card 
            key={action.title}
            className={`
              ${animations.serviceCardHover} 
              ${action.borderColor} 
              ${action.bgColor}
              transition-all cursor-pointer flex flex-col h-full
              ${animations.fadeInUp}
              mobile-card-spacing
              mobile-touch-target
            `}
            style={getStaggerStyle(index, 150)}
            onClick={action.onClick}
          >
            <CardHeader className="text-center pb-4 flex-grow">
              <div className={`mx-auto mb-4 ${animations.iconHover}`}>
                <Icon className={`h-10 w-10 ${isEmergency ? 'text-red-600' : 'text-primary'}`} />
              </div>
              <CardTitle className={`text-xl mobile-text-lg ${isEmergency ? 'text-red-600' : ''}`}>
                {action.title}
              </CardTitle>
              {action.description && (
                <p className="text-base text-muted-foreground mb-4 mobile-text-base">
                  {action.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="text-center pt-0 mt-auto">
              <Button 
                variant={action.buttonVariant}
                size="lg"
                className={`w-full mobile-touch-target text-base ${animations.buttonHover}`}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
              >
                {action.buttonText}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
