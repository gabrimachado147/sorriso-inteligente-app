
import React from 'react';
import { Bot } from 'lucide-react';
import { animations } from '@/lib/animations';

const TypingIndicator: React.FC = () => {
  return (
    <div className={`flex justify-start w-full ${animations.fadeIn}`}>
      <div className="flex items-start gap-3 max-w-[85%] lg:max-w-[70%]">
        {/* Avatar do bot */}
        <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-md border-2 border-white">
          <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
        </div>
        
        {/* Bubble de digitação */}
        <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-md border border-gray-200 relative">
          {/* Arrow indicator */}
          <div className="absolute left-[-6px] top-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm lg:text-base text-gray-600 mr-2">Digitando</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
