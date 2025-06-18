
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { Bot, Send, Calendar, MapPin, Clock, Phone } from 'lucide-react';
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

  // Quick actions atualizadas para focar no processo de agendamento
  const quickActions = [
    {
      text: "Quero agendar uma consulta",
      action: () => handleQuickAction("Quero agendar uma consulta. Quais serviços vocês oferecem?"),
      icon: Calendar
    },
    {
      text: "Ver clínicas disponíveis",
      action: () => handleQuickAction("Onde ficam localizadas as clínicas da Senhor Sorriso?"),
      icon: MapPin
    },
    {
      text: "Consultar horários",
      action: () => handleQuickAction("Quais são os horários de funcionamento?"),
      icon: Clock
    },
    {
      text: "Atendimento de emergência",
      action: () => handleQuickAction("Preciso de atendimento de emergência"),
      icon: Phone
    }
  ];

  const handleFormSubmit = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || chatLoading) return;
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
        <CardTitle className="flex items-center gap-2 text-lg text-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
          Assistente Virtual
          <Badge variant="secondary" className="ml-auto">
            {chatLoading ? 'Processando...' : 'Online'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Estou aqui para ajudar com seus agendamentos na Senhor Sorriso!
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
              isPhoneCollected={true}
            />
          ))}

          {chatLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
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
              placeholder="Digite aqui para conversar"
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
