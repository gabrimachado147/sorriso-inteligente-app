
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { Bot, Send, Calendar, MapPin, Clock, Phone } from 'lucide-react';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { useChatLogic } from '@/hooks/useChatLogic';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import ChatMessage from './ChatMessage';
import QuickActionsGrid from './QuickActionsGrid';
import TypingIndicator from './TypingIndicator';
import { ProcessingIndicator } from './ProcessingIndicator';
import { AppointmentConfirmation } from './AppointmentConfirmation';
import { Message } from './types';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('');
  const [processingStage, setProcessingStage] = useState<'analyzing' | 'scheduling' | 'confirming' | null>(null);
  const [showAppointmentConfirmation, setShowAppointmentConfirmation] = useState<any>(null);
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

  const { 
    permission, 
    requestPermission, 
    notifyAppointmentConfirmed 
  } = usePushNotifications();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, processingStage, showAppointmentConfirmation]);

  // Solicitar permissão para notificações ao carregar
  useEffect(() => {
    if (permission === 'default') {
      setTimeout(() => {
        requestPermission();
      }, 3000); // Aguardar 3 segundos antes de solicitar
    }
  }, [permission, requestPermission]);

  // Quick actions integradas
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

  const handleFormSubmit = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || chatLoading) return;

    setInputValue('');
    
    // Simular estágios de processamento para agendamentos
    if (text.toLowerCase().includes('agendar') || text.toLowerCase().includes('consulta')) {
      setProcessingStage('analyzing');
      
      setTimeout(() => {
        setProcessingStage('scheduling');
        
        setTimeout(() => {
          setProcessingStage('confirming');
          
          setTimeout(() => {
            setProcessingStage(null);
            
            // Simular confirmação de agendamento
            const appointmentData = {
              name: userPhone || 'Cliente',
              service: 'Consulta Odontológica',
              clinic: 'Senhor Sorriso Centro',
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
              time: '14:00'
            };
            
            setShowAppointmentConfirmation(appointmentData);
            notifyAppointmentConfirmed(appointmentData);
            
            // Remover confirmação após 10 segundos
            setTimeout(() => {
              setShowAppointmentConfirmation(null);
            }, 10000);
          }, 2000);
        }, 1500);
      }, 1000);
    }
    
    await handleSendMessage(text);
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
          Estou aqui para ajudar com seus agendamentos na Senhor Sorriso! 🦷
        </p>
        
        {permission === 'default' && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 Ative as notificações para receber confirmações de agendamento!
            </p>
          </div>
        )}
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

          {processingStage && <ProcessingIndicator stage={processingStage} />}
          {chatLoading && !processingStage && <TypingIndicator />}
          {showAppointmentConfirmation && (
            <AppointmentConfirmation appointmentData={showAppointmentConfirmation} />
          )}
          
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
              placeholder="Digite aqui para conversar..."
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
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            {permission === 'granted' ? '🔔 Notificações ativadas' : '🔕 Notificações desativadas'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
