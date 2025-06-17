
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ChatBot } from '@/components/Chat/ChatBot';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const ChatPage = () => {
  return (
    <>
      <PageHead
        title="Chat IA - Senhor Sorriso"
        description="Converse com nossa inteligência artificial sobre saúde bucal, agende consultas e tire suas dúvidas odontológicas."
        keywords="chat IA, inteligência artificial, consulta online, dúvidas odontológicas, atendimento virtual, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/chat"
      />
      <div className="w-full min-h-screen bg-background overflow-x-hidden">
        <MainLayout>
          <div className={`w-full overflow-x-hidden ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-4xl mx-auto">
              <div className="space-y-6 overflow-x-hidden">
                <div className="text-center">
                  <h1 className="text-lg font-bold mobile-text-xl">Chat IA</h1>
                  <p className="text-muted-foreground mobile-text-base mt-2">
                    Converse com nossa inteligência artificial
                  </p>
                </div>
                <ChatBot />
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default ChatPage;
