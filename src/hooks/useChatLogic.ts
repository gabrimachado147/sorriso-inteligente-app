
import { useState } from 'react';
import { apiService } from '@/services/api';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';
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
      // Use the original API service
      const sessionId = `session_${Date.now()}`;
      const response = await apiService.chat.sendMessage(messageText, sessionId);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.actions && response.actions.length > 0 ? 'appointment' : 'general',
        quickReplies: response.actions?.map(action => action.label)
      };
      
      addMessage(botMessage);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
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
