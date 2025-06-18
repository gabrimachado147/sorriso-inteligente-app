
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import ChatBot from '@/components/Chat/ChatBot';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const ChatPage = () => {
  return (
    <>
      <PageHead
        title="Chat IA - Senhor Sorriso"
        description="Converse com nossa inteligência artificial especializada em saúde bucal. Tire dúvidas, agende consultas e receba orientações personalizadas 24/7."
        keywords="chat IA, inteligência artificial, consulta online, dúvidas odontológicas, atendimento virtual, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/chat"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30">
        <MainLayout>
          <div className={`w-full h-full ${animations.pageEnter}`}>
            <div className="container mx-auto px-4 py-4 lg:py-6 h-full max-w-6xl">
              <div className="h-full flex flex-col space-y-4 lg:space-y-6">
                {/* Header da página */}
                <div className="text-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Chat com IA Especializada
                  </h1>
                  <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
                    Converse com nossa inteligência artificial especializada em odontologia
                  </p>
                </div>

                {/* Chat container - Height otimizada */}
                <div className="flex-1 min-h-0">
                  <div className="h-full max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-10rem)]">
                    <ChatBot />
                  </div>
                </div>

                {/* Footer com dicas */}
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4 lg:p-5 backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="font-medium text-blue-900 mb-3 text-sm lg:text-base">
                      💡 Dicas para melhor experiência
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs lg:text-sm text-blue-800">
                      <div className="space-y-1">
                        <p>• Seja específico em suas perguntas sobre saúde bucal</p>
                        <p>• Pergunte sobre tratamentos, prevenção ou cuidados diários</p>
                      </div>
                      <div className="space-y-1">
                        <p>• Use as ações rápidas para agilizar o atendimento</p>
                        <p>• O chat funciona 24 horas por dia, 7 dias por semana</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default ChatPage;
