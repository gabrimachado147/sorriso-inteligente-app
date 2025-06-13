
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Clock } from 'lucide-react';
import { animations } from '@/lib/animations';

interface QuickActionsProps {
  onScheduleClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onScheduleClick }) => {
  const actions = [
    {
      icon: Calendar,
      title: 'Agendar Consulta',
      description: 'Reserve seu horário',
      color: 'bg-blue-500',
      onClick: onScheduleClick
    },
    {
      icon: MessageCircle,
      title: 'Chat',
      description: 'Fale conosco',
      color: 'bg-green-500',
      onClick: () => window.location.href = '/chat'
    },
    {
      icon: MapPin,
      title: 'Clínicas',
      description: 'Encontre a mais próxima',
      color: 'bg-purple-500',
      onClick: () => window.location.href = '/clinics'
    },
    {
      icon: Clock,
      title: 'Administrativo',
      description: 'Área administrativa',
      color: 'bg-orange-500',
      onClick: () => window.location.href = '/appointments'
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Acesso Rápido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.title}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${animations.fadeIn}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={action.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
