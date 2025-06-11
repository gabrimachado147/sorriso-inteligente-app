import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Calendar, MessageCircle, User } from 'lucide-react';

interface SidebarNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'locations', icon: MapPin, label: 'Unidades' },
    { id: 'appointments', icon: Calendar, label: 'Agendar' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const handleNavigation = (page: string) => {
    onPageChange(page);
  };

  return (
    <nav className="hidden md:flex md:flex-col md:w-48 md:border-r md:bg-white md:py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`justify-start rounded-none px-4 py-3 border-l-4 ${isActive ? 'border-primary text-primary' : 'border-transparent'} hover:bg-muted`}
            onClick={() => handleNavigation(item.id)}
          >
            <Icon className="h-5 w-5 mr-2" />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};
