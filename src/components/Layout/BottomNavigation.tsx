
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      path: '/chat',
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      label: 'Agendar',
      path: '/schedule',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      label: 'Clínicas',
      path: '/clinics',
      color: 'text-orange-600'
    },
    {
      icon: AlertTriangle,
      label: 'Emergência',
      path: '/emergency',
      color: 'text-red-600'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 safe-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "bg-primary/10" 
                  : "hover:bg-gray-50 active:bg-gray-100"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-colors",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-colors truncate",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
