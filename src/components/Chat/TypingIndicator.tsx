
import React from 'react';
import { Bot } from 'lucide-react';
import { animations } from '@/lib/animations';

const TypingIndicator: React.FC = () => {
  return (
    <div className={`flex justify-start ${animations.fadeIn}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-gray-600" />
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
