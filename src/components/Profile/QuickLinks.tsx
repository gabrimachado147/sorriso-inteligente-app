
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Bell, 
  Settings,
  History,
  Accessibility
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

interface QuickLinksProps {
  onTabChange?: (tabValue: string) => void;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ onTabChange }) => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: Calendar,
      title: 'Agendar Consulta',
      description: 'Marque uma nova consulta',
      color: 'bg-blue-500',
      action: () => navigate('/schedule')
    },
    {
      icon: History,
      title: 'Histórico',
      description: 'Ver consultas anteriores',
      color: 'bg-green-500',
      action: () => {
        if (onTabChange) {
          onTabChange('history');
        }
      }
    },
    {
      icon: MessageCircle,
      title: 'Chat Suporte',
      description: 'Fale com nossa equipe',
      color: 'bg-purple-500',
      action: () => navigate('/chat')
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Configurar lembretes',
      color: 'bg-orange-500',
      action: () => {
        if (onTabChange) {
          onTabChange('notifications');
        }
      }
    },
    {
      icon: Accessibility,
      title: 'Acessibilidade',
      description: 'Configurações de acesso',
      color: 'bg-indigo-500',
      action: () => {
        if (onTabChange) {
          onTabChange('accessibility');
        }
      }
    }
  ];

  return (
    <Card className={`${animations.fadeIn} mobile-card-spacing overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-primary" />
          Recursos Avançados
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200 group"
              onClick={link.action}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg ${link.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <link.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {link.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
