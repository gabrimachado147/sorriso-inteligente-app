
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  User,
  BarChart3
} from 'lucide-react';
import { animations } from '@/lib/animations';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: 'Início', 
      path: '/',
      isActive: location.pathname === '/'
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      path: '/chat',
      isActive: location.pathname === '/chat'
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
      icon: BarChart3, 
      label: 'Administrativo', 
      path: '/appointments',
      isActive: location.pathname === '/appointments'
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
      <div className="max-w-lg mx-auto px-1 sm:px-3">
        <div className="flex justify-around items-center py-1.5 sm:py-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5 min-w-0 flex-1 rounded-xl transition-all duration-200 ${animations.buttonHover} ${
                  item.isActive 
                    ? 'text-primary bg-primary/15 scale-105' 
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative mb-0.5">
                  <Icon 
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${
                      item.isActive ? 'scale-110 drop-shadow-sm' : ''
                    }`} 
                  />
                  {item.isActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight transition-all duration-200 ${
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
