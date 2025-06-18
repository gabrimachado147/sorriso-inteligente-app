
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User } from 'lucide-react';
import { animations } from '@/lib/animations';
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

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${animations.fadeIn}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flex items-start gap-2 max-w-[80%] ${
        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.sender === 'user' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {message.sender === 'user' ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        <div className={`rounded-lg p-3 ${
          message.sender === 'user'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-900'
        } ${animations.scaleIn}`}>
          <div className="whitespace-pre-wrap text-sm">
            {message.text}
          </div>
          
          {message.quickReplies && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.quickReplies.map((reply, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  className={`text-xs ${animations.buttonHover}`}
                  onClick={() => onQuickAction(reply)}
                  disabled={disabled || !isPhoneCollected}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}
          
          <div className={`text-xs mt-2 ${
            message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
