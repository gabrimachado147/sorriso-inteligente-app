
import { useState } from 'react';
import { useChatHandler } from './useChatHandler';
import { toastError } from '@/components/ui/custom-toast';
import { Message } from '@/components/Chat/types';

export const useChatLogic = (userPhone: string, isPhoneCollected: boolean) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Bem-vindo à Senhor Sorriso! 😊 Para começar, preciso do seu número de telefone para enviar as informações do agendamento.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const { sendMessage } = useChatHandler();

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addMessages = (newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'general'
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      console.log('Enviando mensagem para webhook N8N:', messageText);
      
      // Use the webhook integration from useChatHandler
      const response = await sendMessage(
        messageText, 
        'general', 
        userPhone
      );
      
      if (response && response.output) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.output,
          sender: 'bot',
          timestamp: new Date(),
          type: 'general',
          // Check if response suggests quick actions
          quickReplies: response.output.toLowerCase().includes('agendar') || 
                       response.output.toLowerCase().includes('consulta') || 
                       response.output.toLowerCase().includes('clínica') ?
                       ['Agendar consulta', 'Ver clínicas próximas', 'Horários disponíveis'] : undefined
        };
        
        addMessage(botMessage);
        console.log('Resposta do webhook N8N recebida:', response.output);
      } else {
        throw new Error('Resposta inválida do webhook');
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem para webhook N8N:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'general'
      };
      
      addMessage(errorMessage);
      toastError('Erro', 'Não foi possível enviar sua mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (message: string) => {
    if (!isPhoneCollected) {
      toastError('Telefone necessário', 'Por favor, forneça seu número de telefone primeiro.');
      return;
    }
    await handleSendMessage(message);
  };

  return {
    messages,
    chatLoading: loading,
    addMessage,
    addMessages,
    handleSendMessage,
    handleQuickAction
  };
};
