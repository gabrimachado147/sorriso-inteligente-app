
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone } from 'lucide-react';
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
      description: "Nova consulta",
      path: "/schedule",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: MessageCircle,
      title: "Chat IA",
      description: "Tire suas dúvidas",
      path: "/chat",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: MapPin,
      title: "Unidades",
      description: "5 cidades",
      path: "/clinics",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Phone,
      title: "Urgência",
      description: "Contato emergência",
      path: "",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      isEmergency: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isEmergency = action.isEmergency;
        
        return (
          <Card 
            key={action.title}
            className={`
              cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center
              ${action.borderColor} ${action.bgColor}
              ${animations.fadeInUp}
              mobile-card-spacing mobile-touch-target
            `}
            style={getStaggerStyle(index, 150)}
            onClick={() => isEmergency ? onEmergencyCall() : onNavigate(action.path)}
          >
            <CardContent className="p-4 md:p-6">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${action.bgColor} border-2 ${action.borderColor}`}>
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${action.color}`} />
              </div>
              <h3 className={`text-base md:text-lg font-semibold mb-1 mobile-text-sm ${action.color}`}>
                {action.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mobile-text-xs">
                {action.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
