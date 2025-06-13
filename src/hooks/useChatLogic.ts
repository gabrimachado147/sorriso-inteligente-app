
import { useState } from 'react';
import { useChatHandler } from './useChatHandler';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';
import { Message } from '@/components/Chat/types';

export const useChatLogic = (userPhone: string, isPhoneCollected: boolean) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da Sorriso Inteligente. Para começar, preciso do seu número de telefone para enviar as informações do agendamento.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);

  const { sendMessage, sendWhatsAppMessage, loading: chatLoading } = useChatHandler();

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addMessages = (newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || chatLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'general'
    };

    addMessage(userMessage);

    // Send message to webhook and handle response
    try {
      const context = messageText.toLowerCase().includes('agendar') ? 'appointment' : 
                    messageText.toLowerCase().includes('emergência') ? 'emergency' : 'general';
      
      const response = await sendMessage(messageText, context, userPhone);
      
      if (response && response.output) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.output,
          sender: 'bot',
          timestamp: new Date(),
          type: context as any
        };
        
        addMessage(botMessage);

        // Check if an appointment was created and send notifications
        if (context === 'appointment' && response.output.toLowerCase().includes('agendamento confirmado')) {
          await sendAppointmentNotifications(response.output);
        }
      } else {
        const confirmationMessage: Message = {
          id: Date.now() + 1,
          text: "Sua mensagem foi enviada para nossa equipe. Em breve você receberá uma resposta.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'general'
        };
        
        addMessage(confirmationMessage);
      }
      
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
    }
  };

  const sendAppointmentNotifications = async (appointmentDetails: string) => {
    try {
      // Send confirmation to user
      await sendWhatsAppMessage(userPhone, `✅ *Agendamento Confirmado!*\n\n${appointmentDetails}\n\nObrigado por escolher a Sorriso Inteligente!`);
      
      // Send notification to clinic
      const clinicNumber = '+5531971907025';
      await sendWhatsAppMessage(clinicNumber, `🔔 *Novo Agendamento via Chat*\n\n👤 Cliente: ${userPhone}\n📋 Detalhes:\n${appointmentDetails}\n\n⏰ Agendado em: ${new Date().toLocaleString('pt-BR')}`);
      
      toastSuccess('Notificações enviadas', 'Confirmação enviada para seu WhatsApp e clínica notificada');
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      toastError('Erro nas notificações', 'Agendamento criado, mas houve erro ao enviar notificações');
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
    chatLoading,
    addMessage,
    addMessages,
    handleSendMessage,
    handleQuickAction
  };
};
