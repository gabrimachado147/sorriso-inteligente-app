
import React from 'react';
import { Button } from '@/components/ui/button';
import { toastInfo } from '@/components/ui/custom-toast';
import { animations } from '@/lib/animations';
import { Home, MessageCircle, Calendar, User, MapPin, Phone } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onPageChange }) => {
  const handleNavigation = (page: string, label: string) => {
    toastInfo(`Navegação`, `Abrindo ${label}...`);
    onPageChange(page);
  };

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Início',
      action: () => handleNavigation('home', 'página inicial')
    },
    { 
      id: 'locations', 
      icon: MapPin, 
      label: 'Unidades',
      action: () => handleNavigation('locations', 'unidades')
    },
    { 
      id: 'appointments', 
      icon: Calendar, 
      label: 'Agendar',
      action: () => handleNavigation('appointments', 'agendamento')
    },
    { 
      id: 'chat', 
      icon: MessageCircle, 
      label: 'Chat',
      action: () => handleNavigation('chat', 'chat com assistente')
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Perfil',
      action: () => handleNavigation('profile', 'perfil do usuário')
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-between items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 flex-1 ${
                isActive ? 'text-primary' : 'text-gray-500'
              } ${animations.buttonHover}`}
              onClick={item.action}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
