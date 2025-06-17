
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import ChatBot from '@/components/Chat/ChatBot';
import { PageHead } from '@/components/SEO/PageHead';

const ChatPage = () => {
  return (
    <>
      <PageHead
        title="Chat Odontológico - Assistente IA"
        description="Converse com nosso assistente de IA especializado em odontologia. Tire suas dúvidas sobre saúde bucal 24 horas por dia."
        keywords="chat odontológico, IA dentista, assistente virtual, dúvidas odontologia, saúde bucal, atendimento 24h"
        url="https://senhorsorrisso.com.br/chat"
      />
      <MainLayout>
        <ChatBot />
      </MainLayout>
    </>
  );
};

export default ChatPage;
