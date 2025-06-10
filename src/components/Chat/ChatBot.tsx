import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { toastSuccess, toastInfo, toastAppointment, toastError } from '@/components/ui/custom-toast';
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
  const [isTyping, setIsTyping] = useState(false);
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

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      // Tentar processar via n8n primeiro
      const context: Message['type'] = lowerMessage.includes('agendar')
        ? 'appointment'
        : lowerMessage.includes('emergência')
          ? 'emergency'
          : 'general';
      
      const response = await sendMessage(userMessage, context);
      
      if (response?.reply) {
        return {
          id: Date.now(),
          text: response.reply,
          sender: 'bot',
          timestamp: new Date(),
          type: context
        };
      }
    } catch (error) {
      console.error('Erro ao processar via n8n:', error);
    }

    // Fallback para respostas locais
    if (lowerMessage.includes('agendar') || lowerMessage.includes('consulta')) {
      toastAppointment("Agendamento", "Vou te ajudar a agendar sua consulta!");
      return {
        id: Date.now(),
        text: "Perfeito! Para agendar sua consulta, preciso de algumas informações. Você prefere qual tipo de serviço?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'appointment',
        quickReplies: ['Limpeza', 'Extração', 'Obturação', 'Ortodontia']
      };
    }
    
    if (lowerMessage.includes('clínica') || lowerMessage.includes('local')) {
      toastInfo("Clínicas", "Mostrando clínicas próximas a você!");
      return {
        id: Date.now(),
        text: "Temos várias clínicas próximas a você! Posso te mostrar as opções por região:",
        sender: 'bot',
        timestamp: new Date(),
        type: 'location',
        quickReplies: ['Centro', 'Zona Sul', 'Zona Norte', 'Zona Oeste']
      };
    }
    
    if (lowerMessage.includes('horário') || lowerMessage.includes('disponível')) {
      return {
        id: Date.now(),
        text: "Nossos horários de atendimento são:\n\n📅 Segunda a Sexta: 8h às 18h\n📅 Sábados: 8h às 14h\n\nPara qual dia você gostaria de agendar?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'schedule'
      };
    }
    
    if (lowerMessage.includes('emergência') || lowerMessage.includes('urgente')) {
      return {
        id: Date.now(),
        text: "🚨 Para emergências, entre em contato imediatamente:\n\n📞 Central de Emergência: (11) 99999-0000\n🏥 Plantão 24h: Rua da Saúde, 123\n\nVocê precisa de atendimento imediato?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'emergency',
        quickReplies: ['Sim, preciso agora', 'Não é urgente', 'Mais informações']
      };
    }
    
    return {
      id: Date.now(),
      text: "Entendi! Como posso te ajudar melhor? Posso auxiliar com agendamentos, informações sobre clínicas, horários ou emergências.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'general',
      quickReplies: ['Agendar consulta', 'Ver clínicas', 'Horários', 'Emergência']
    };
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
    setIsTyping(true);

    // Simular delay de digitação e processar resposta
    try {
      const botResponse = await generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      toastError('Erro', 'Não foi possível processar sua mensagem');
    } finally {
      setIsTyping(false);
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
            {chatLoading ? 'Processando...' : 'Online'}
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

          
          {(isTyping || chatLoading) && (
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
              disabled={isTyping || chatLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping || chatLoading}
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
