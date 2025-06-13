
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
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ${animations.slideInBottom}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 ${animations.buttonHover} ${
                  item.isActive 
                    ? 'text-primary scale-105' 
                    : 'text-gray-500 hover:text-primary hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <Icon 
                    className={`h-6 w-6 mb-1 transition-all duration-200 ${
                      item.isActive ? 'scale-110 drop-shadow-md' : ''
                    }`} 
                  />
                  {item.isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-200 ${
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
