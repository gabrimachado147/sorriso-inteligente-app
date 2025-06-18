
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import ChatBot from '@/components/Chat/ChatBot';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { GamificationStats } from '@/components/ui/gamification-elements';
import { LoadingMicroInteraction } from '@/components/ui/micro-interactions';
import { animations } from '@/lib/animations';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const EnhancedChatPage = () => {
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Início', href: '/', icon: undefined },
    { label: 'Chat IA', href: '/chat', icon: MessageCircle }
  ];

  return (
    <>
      <PageHead
        title="Chat IA Avançado - Senhor Sorriso"
        description="Converse com nossa inteligência artificial especializada em saúde bucal. Tire dúvidas, agende consultas e receba orientações personalizadas 24/7."
        keywords="chat IA, inteligência artificial, consulta online, dúvidas odontológicas, atendimento virtual, assistente dental, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/chat"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-x-hidden">
        <MainLayout>
          <div className={`w-full overflow-x-hidden ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-6xl mx-auto">
              <div className="space-y-6 overflow-x-hidden">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header melhorado */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    Chat com IA Especializada
                  </h1>
                  <p className="text-muted-foreground mobile-text-base mt-2 max-w-2xl mx-auto">
                    Converse com nossa inteligência artificial especializada em odontologia. 
                    Tire dúvidas, receba orientações e agende consultas de forma inteligente.
                  </p>
                </div>

                {/* Gamificação */}
                <div className="md:hidden">
                  <GamificationStats />
                </div>

                {/* Layout responsivo */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Gamificação lateral desktop */}
                  <div className="hidden lg:block">
                    <GamificationStats />
                  </div>

                  {/* Chat principal */}
                  <div className="lg:col-span-2">
                    <LoadingMicroInteraction loading={loading} loadingText="Inicializando IA...">
                      <ChatBot />
                    </LoadingMicroInteraction>
                  </div>

                  {/* Feedback lateral */}
                  <div className="space-y-6">
                    <FeedbackSystem 
                      pageContext="Chat IA"
                      onSubmit={(feedback) => {
                        console.log('Feedback do Chat:', feedback);
                        // Aqui integraria com analytics
                      }}
                    />
                  </div>
                </div>

                {/* Dicas de uso */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">💡 Dicas para melhor experiência:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Seja específico em suas perguntas sobre saúde bucal</li>
                    <li>• Use o comando /agendar para marcar consultas rapidamente</li>
                    <li>• Pergunte sobre tratamentos, prevenção ou cuidados diários</li>
                    <li>• O chat funciona 24 horas por dia, 7 dias por semana</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedChatPage;
