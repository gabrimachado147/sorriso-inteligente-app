
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { Bot, Send, Calendar, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { useChatLogic } from '@/hooks/useChatLogic';
import ChatMessage from './ChatMessage';
import QuickActionsGrid from './QuickActionsGrid';
import TypingIndicator from './TypingIndicator';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';
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
    <div className="w-full h-full flex flex-col">
      {/* Header melhorado */}
      <Card className={`flex-none border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50 ${animations.fadeIn}`}>
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex items-center justify-center gap-3 text-xl lg:text-2xl">
            <div className="relative">
              <MessageCircle className="h-7 w-7 lg:h-8 lg:w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-gray-900">Assistente Virtual</span>
            <Badge 
              variant="secondary" 
              className={`ml-2 ${chatLoading ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} transition-all duration-300`}
            >
              {chatLoading ? 'Processando...' : 'Online'}
            </Badge>
          </CardTitle>
          <p className="text-sm lg:text-base text-gray-600 text-center mt-2 max-w-2xl mx-auto">
            Olá! Sou seu assistente especializado em odontologia. Estou aqui para ajudar com agendamentos, 
            informações sobre tratamentos e orientações sobre nossa clínica.
          </p>
        </CardHeader>
      </Card>

      {/* Chat Container - Responsivo */}
      <Card className="flex-1 flex flex-col mt-4 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex-1 flex flex-col p-0 h-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white min-h-0">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div key={message.id} className={`${animations.fadeInUp}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <ChatMessage
                    message={message}
                    index={index}
                    onQuickAction={handleQuickAction}
                    disabled={chatLoading}
                    isPhoneCollected={true}
                  />
                </div>
              ))}

              {chatLoading && (
                <div className={animations.fadeIn}>
                  <TypingIndicator />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions - Apenas para primeiras interações */}
          {messages.length <= 2 && (
            <div className="flex-none border-t border-gray-100 bg-white/90 backdrop-blur-sm">
              <QuickActionsGrid 
                onQuickAction={handleQuickAction}
                disabled={chatLoading}
              />
            </div>
          )}

          {/* Input Area - Design melhorado */}
          <div className="flex-none p-4 lg:p-6 border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem aqui..."
                    className="min-h-[48px] pr-4 pl-4 text-base lg:text-lg border-2 border-gray-200 focus:border-primary transition-all duration-300 rounded-2xl shadow-sm"
                    disabled={chatLoading}
                  />
                  {inputValue.trim() && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                <InteractiveFeedback feedbackType="scale">
                  <Button
                    onClick={() => handleFormSubmit()}
                    disabled={!inputValue.trim() || chatLoading}
                    size="lg"
                    className={`min-h-[48px] px-6 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${animations.buttonHover}`}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Enviar mensagem</span>
                  </Button>
                </InteractiveFeedback>
              </div>
              
              {/* Dica de uso */}
              <div className="mt-3 text-center">
                <p className="text-xs lg:text-sm text-gray-500">
                  💡 Dica: Seja específico em suas perguntas para respostas mais precisas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
