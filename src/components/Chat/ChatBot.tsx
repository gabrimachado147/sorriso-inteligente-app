
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { Bot, Send } from 'lucide-react';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { useChatLogic } from '@/hooks/useChatLogic';
import ChatMessage from './ChatMessage';
import QuickActionsGrid from './QuickActionsGrid';
import TypingIndicator from './TypingIndicator';
import { Message } from './types';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    userPhone, 
    isPhoneCollected, 
    handlePhoneSubmission 
  } = usePhoneValidation();

  const { 
    messages, 
    chatLoading, 
    addMessage, 
    addMessages, 
    handleSendMessage, 
    handleQuickAction 
  } = useChatLogic(userPhone, isPhoneCollected);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePhoneInput = async (phoneText: string) => {
    const formattedPhone = handlePhoneSubmission(phoneText);
    
    if (formattedPhone) {
      // Send phone confirmation to webhook instead of local response
      await handleSendMessage(`Meu telefone é: ${formattedPhone}`);
    } else {
      // Send invalid phone message to webhook to get proper response
      await handleSendMessage(phoneText);
    }
  };

  const handleFormSubmit = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || chatLoading) return;

    // Handle phone number collection
    if (!isPhoneCollected) {
      await handlePhoneInput(text);
      setInputValue('');
      return;
    }

    // Handle regular chat messages via webhook
    await handleSendMessage(text);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <Card className={`h-full flex flex-col ${animations.fadeIn}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Assistente Virtual
          <Badge variant="secondary" className="ml-auto">
            {chatLoading ? 'Processando...' : 'Online'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isPhoneCollected 
            ? `Conectado: ${userPhone} - Estou aqui para ajudar com seus agendamentos na Senhor Sorriso!`
            : 'Para começar, informe seu WhatsApp para contato!'
          }
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              index={index}
              onQuickAction={handleQuickAction}
              disabled={chatLoading}
              isPhoneCollected={isPhoneCollected}
            />
          ))}

          {chatLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {isPhoneCollected && messages.length <= 2 && (
          <QuickActionsGrid 
            onQuickAction={handleQuickAction}
            disabled={chatLoading}
          />
        )}

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isPhoneCollected ? "Digite sua mensagem..." : "Digite seu WhatsApp para contato..."}
              className="flex-1"
              disabled={chatLoading}
            />
            <Button
              onClick={() => handleFormSubmit()}
              disabled={!inputValue.trim() || chatLoading}
              className={animations.buttonHover}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
