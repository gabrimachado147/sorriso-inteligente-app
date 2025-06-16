
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  User
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleNavClick = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const navItems = [
    { 
      icon: Home, 
      label: 'Início', 
      path: '/',
      isActive: location.pathname === '/'
    },
    { 
      icon: Calendar, 
      label: 'Agendar', 
      path: '/schedule',
      isActive: location.pathname === '/schedule'
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      path: '/chat',
      isActive: location.pathname === '/chat'
    },
    { 
      icon: MapPin, 
      label: 'Unidades', 
      path: '/clinics',
      isActive: location.pathname === '/clinics'
    },
    { 
      icon: User, 
      label: 'Perfil', 
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  if (!isMobile) {
    return null;
  }

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 z-50 safe-bottom shadow-lg ${animations.slideInBottom}`}>
      <div className="px-2 py-1">
        <div className="flex justify-around items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`
                  mobile-nav-item rounded-xl mobile-transition mobile-press mobile-focus
                  flex flex-col items-center justify-center px-3 py-2 min-w-[64px]
                  ${item.isActive 
                    ? 'text-primary bg-primary/10 scale-105 shadow-sm' 
                    : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative mb-1">
                  <Icon 
                    className={`h-5 w-5 mobile-transition ${
                      item.isActive ? 'scale-110 drop-shadow-sm' : ''
                    }`} 
                  />
                  {item.isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-xs font-medium text-center leading-tight mobile-transition ${
                  item.isActive ? 'font-semibold text-primary' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
