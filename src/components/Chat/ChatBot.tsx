
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { toastSuccess, toastInfo, toastError } from '@/components/ui/custom-toast';
import { useChatHandler } from '@/hooks/useChatHandler';
import { animations } from '@/lib/animations';
import { MessageCircle, Send, Bot, User, Clock, Calendar, MapPin, Phone } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'welcome' | 'general' | 'appointment' | 'location' | 'schedule' | 'emergency';
  quickReplies?: string[];
}

type QuickAction = {
  text: string;
  action: () => void;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da Sorriso Inteligente. Como posso ajudar você hoje?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, loading: chatLoading } = useChatHandler();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      text: "Agendar consulta",
      action: () => handleQuickAction("Quero agendar uma consulta"),
      icon: Calendar
    },
    {
      text: "Encontrar clínicas",
      action: () => handleQuickAction("Onde encontro clínicas próximas?"),
      icon: MapPin
    },
    {
      text: "Horários disponíveis",
      action: () => handleQuickAction("Quais horários estão disponíveis?"),
      icon: Clock
    },
    {
      text: "Contato emergência",
      action: () => handleQuickAction("Preciso de atendimento de emergência"),
      icon: Phone
    }
  ];

  const handleQuickAction = async (message: string) => {
    setInputValue(message);
    await handleSendMessage(message);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || chatLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'general'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Enviar dados para o webhook sem gerar resposta automática
    try {
      const context = text.toLowerCase().includes('agendar') ? 'appointment' : 
                    text.toLowerCase().includes('emergência') ? 'emergency' : 'general';
      
      await sendMessage(text, context);
      
      // Adicionar mensagem informativa de que a mensagem foi enviada
      const confirmationMessage: Message = {
        id: Date.now() + 1,
        text: "Sua mensagem foi enviada para nossa equipe. Em breve você receberá uma resposta.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'general'
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toastError('Erro', 'Não foi possível enviar sua mensagem');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <EnhancedSkeleton variant="chat-message" count={3} />
      </div>
    );
  }

  return (
    <Card className={`h-full flex flex-col ${animations.fadeIn}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Assistente Virtual
          <Badge variant="secondary" className="ml-auto">
            {chatLoading ? 'Enviando...' : 'Online'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Estou aqui para ajudar com seus agendamentos e dúvidas!
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message, index) => (
            <div
              key={message.id}
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
                          onClick={() => handleQuickAction(reply)}
                          disabled={chatLoading}
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
          ))}

          {chatLoading && (
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
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className={`p-4 border-t border-gray-200 ${animations.slideInBottom}`}>
            <p className="text-sm text-gray-600 mb-3">Ações rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`justify-start gap-2 ${animations.buttonHover}`}
                  onClick={action.action}
                  disabled={chatLoading}
                >
                  <action.icon className="h-4 w-4" />
                  {action.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={chatLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
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
