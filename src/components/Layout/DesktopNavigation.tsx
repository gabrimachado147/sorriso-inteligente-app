
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  AlertCircle,
  User
} from 'lucide-react';

export const DesktopNavigation: React.FC = () => {
  const location = useLocation();
  const {
    navigateToPage,
    handleChatNavigation,
    handleScheduleNavigation,
    handleClinicsNavigation,
    handleEmergencyNavigation
  } = useHomeNavigation();

  const navigationItems = [
    {
      title: 'Início',
      href: '/',
      icon: Home,
      onClick: () => navigateToPage('/')
    },
    {
      title: 'Chat IA',
      href: '/chat',
      icon: MessageCircle,
      onClick: handleChatNavigation
    },
    {
      title: 'Agendar',
      href: '/schedule',
      icon: Calendar,
      onClick: handleScheduleNavigation
    },
    {
      title: 'Clínicas',
      href: '/clinics',
      icon: MapPin,
      onClick: handleClinicsNavigation
    },
    {
      title: 'Emergência',
      href: '/emergency',
      icon: AlertCircle,
      onClick: handleEmergencyNavigation
    },
    {
      title: 'Perfil',
      href: '/profile',
      icon: User,
      onClick: () => navigateToPage('/profile')
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer flex items-center space-x-2 px-3 py-2",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}
                onClick={item.onClick}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
