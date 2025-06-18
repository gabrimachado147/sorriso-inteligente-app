
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User } from 'lucide-react';
import { animations } from '@/lib/animations';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  index: number;
  onQuickAction: (action: string) => void;
  disabled: boolean;
  isPhoneCollected: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  index, 
  onQuickAction, 
  disabled, 
  isPhoneCollected 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex items-start gap-3 max-w-[85%] lg:max-w-[70%] ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}>
        
        {/* Avatar com melhor contraste */}
        <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-primary to-blue-600 text-white' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-2 border-white'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 lg:h-6 lg:w-6" />
          ) : (
            <Bot className="h-5 w-5 lg:h-6 lg:w-6" />
          )}
        </div>

        {/* Message bubble com melhor design */}
        <div className={`rounded-2xl p-4 lg:p-5 shadow-md relative ${
          isUser
            ? 'bg-gradient-to-br from-primary to-blue-600 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        } ${animations.scaleIn}`}>
          
          {/* Arrow indicator */}
          <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
            isUser 
              ? 'right-[-6px] bg-gradient-to-br from-primary to-blue-600' 
              : 'left-[-6px] bg-white border-l border-t border-gray-200'
          }`}></div>
          
          <div className="relative z-10">
            <div className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
              {message.text}
            </div>
            
            {/* Quick replies com melhor design */}
            {message.quickReplies && (
              <div className="flex flex-wrap gap-2 mt-4">
                {message.quickReplies.map((reply, idx) => (
                  <InteractiveFeedback key={idx} feedbackType="scale">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`text-xs lg:text-sm bg-white/90 hover:bg-white border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 ${animations.buttonHover}`}
                      onClick={() => onQuickAction(reply)}
                      disabled={disabled || !isPhoneCollected}
                    >
                      {reply}
                    </Button>
                  </InteractiveFeedback>
                ))}
              </div>
            )}
            
            {/* Timestamp com melhor contraste */}
            <div className={`text-xs mt-3 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
