
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

const BottomNavigation = () => {
  const location = useLocation();

  const handleNavClick = () => {
    // Scroll para o topo quando navegar
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
      icon: MapPin, 
      label: 'Clínicas', 
      path: '/clinics',
      isActive: location.pathname === '/clinics'
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      path: '/chat',
      isActive: location.pathname === '/chat'
    },
    { 
      icon: User, 
      label: 'Perfil', 
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 ${animations.slideInBottom}`}>
      <div className="max-w-md mx-auto px-2">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 rounded-xl transition-all duration-200 ${animations.buttonHover} ${
                  item.isActive 
                    ? 'text-primary bg-primary/15 scale-105' 
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative mb-1">
                  <Icon 
                    className={`h-5 w-5 transition-all duration-200 ${
                      item.isActive ? 'scale-110 drop-shadow-sm' : ''
                    }`} 
                  />
                  {item.isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-xs font-medium text-center leading-tight transition-all duration-200 ${
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
