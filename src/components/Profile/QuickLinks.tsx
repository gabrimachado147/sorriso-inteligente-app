
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
    <Card className={`${animations.fadeIn} mb-6 mobile-card-spacing overflow-hidden`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 mobile-text-lg">
          <Settings className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
          <span className="truncate">Recursos Avançados</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden">
          {quickLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-3 text-left justify-start hover:shadow-md transition-all duration-200 mobile-touch-target ${animations.buttonHover} overflow-hidden`}
              onClick={link.action}
            >
              <div className="flex items-start gap-3 w-full min-w-0">
                <div className={`p-2 rounded-lg ${link.color} flex-shrink-0`}>
                  <link.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate mobile-text-sm">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 mobile-text-xs truncate">
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
