
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Shield, 
  Bell, 
  Gamepad2, 
  Settings,
  History,
  Heart,
  Award,
  Accessibility
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

export const QuickLinks = () => {
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
        // Navigate to the history tab within the profile page
        const profileUrl = new URL(window.location.href);
        profileUrl.hash = '#history';
        window.location.href = profileUrl.toString();
        
        // Trigger tab change programmatically
        setTimeout(() => {
          const historyTab = document.querySelector('[value="history"]') as HTMLElement;
          if (historyTab) {
            historyTab.click();
          }
        }, 100);
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
        // Navigate to the notifications tab within the profile page
        const profileUrl = new URL(window.location.href);
        profileUrl.hash = '#notifications';
        window.location.href = profileUrl.toString();
        
        // Trigger tab change programmatically
        setTimeout(() => {
          const notificationsTab = document.querySelector('[value="notifications"]') as HTMLElement;
          if (notificationsTab) {
            notificationsTab.click();
          }
        }, 100);
      }
    },
    {
      icon: Gamepad2,
      title: 'Gamificação',
      description: 'Ver pontos e conquistas',
      color: 'bg-pink-500',
      action: () => {
        // Navigate to the gamification tab within the profile page
        const profileUrl = new URL(window.location.href);
        profileUrl.hash = '#gamification';
        window.location.href = profileUrl.toString();
        
        // Trigger tab change programmatically
        setTimeout(() => {
          const gamificationTab = document.querySelector('[value="gamification"]') as HTMLElement;
          if (gamificationTab) {
            gamificationTab.click();
          }
        }, 100);
      }
    },
    {
      icon: Accessibility,
      title: 'Acessibilidade',
      description: 'Configurações de acesso',
      color: 'bg-indigo-500',
      action: () => {
        // Navigate to the accessibility tab within the profile page
        const profileUrl = new URL(window.location.href);
        profileUrl.hash = '#accessibility';
        window.location.href = profileUrl.toString();
        
        // Trigger tab change programmatically
        setTimeout(() => {
          const accessibilityTab = document.querySelector('[value="accessibility"]') as HTMLElement;
          if (accessibilityTab) {
            accessibilityTab.click();
          }
        }, 100);
      }
    }
  ];

  return (
    <Card className={`${animations.fadeIn} mb-8`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Recursos Avançados
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 text-left justify-start hover:shadow-md transition-all duration-200 ${animations.buttonHover}`}
              onClick={link.action}
            >
              <div className="flex items-start gap-3 w-full">
                <div className={`p-2 rounded-lg ${link.color}`}>
                  <link.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
