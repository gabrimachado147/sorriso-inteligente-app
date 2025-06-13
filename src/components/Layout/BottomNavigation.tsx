
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  User,
  CalendarCheck
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
      icon: CalendarCheck, 
      label: 'Agendados', 
      path: '/appointments',
      isActive: location.pathname === '/appointments'
    },
    { 
      icon: MapPin, 
      label: 'Clínicas', 
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

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ${animations.slideInBottom}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${animations.buttonHover} ${
                  item.isActive 
                    ? 'text-primary' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon 
                  className={`h-5 w-5 mb-1 transition-all duration-200 ${
                    item.isActive ? 'scale-110' : ''
                  }`} 
                />
                <span className={`text-xs font-medium transition-all duration-200 ${
                  item.isActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                {item.isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
