
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { animations } from '@/lib/animations';

export const FloatingChatBubble: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar o balão na página de chat nem no dashboard admin
  if (location.pathname === '/chat' || location.pathname === '/appointments') {
    return null;
  }

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      <Button
        onClick={handleChatClick}
        size="lg"
        className={`
          h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 
          ${animations.buttonHover} ${animations.fadeIn}
          transition-all duration-300 hover:scale-110
        `}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Iniciar Chat
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};
