
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Accessibility, Trophy, BarChart3, Bell } from 'lucide-react';

export const QuickLinks: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    {
      icon: Accessibility,
      title: 'Acessibilidade',
      description: 'Configurações de acessibilidade',
      path: '/accessibility',
      color: 'text-blue-600'
    },
    {
      icon: Trophy,
      title: 'Gamificação',
      description: 'Pontos e conquistas',
      path: '/gamification',
      color: 'text-yellow-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Dashboard de saúde',
      path: '/analytics',
      color: 'text-green-600'
    },
    {
      icon: Bell,
      title: 'Lembretes',
      description: 'Gerenciar lembretes',
      path: '/reminders',
      color: 'text-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos Avançados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map((link) => (
            <Button
              key={link.path}
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => navigate(link.path)}
            >
              <link.icon className={`h-5 w-5 mr-3 ${link.color}`} />
              <div className="text-left">
                <div className="font-medium">{link.title}</div>
                <div className="text-sm text-muted-foreground">
                  {link.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
