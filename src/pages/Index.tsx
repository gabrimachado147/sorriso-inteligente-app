
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { EnhancedHomePage } from '@/components/Home/EnhancedHomePage';
import { PageHead } from '@/components/SEO/PageHead';

const Index = () => {
  return (
    <>
      <PageHead
        title="Senhor Sorriso - Clínica Odontológica de Excelência"
        description="Cuidado odontológico de excelência com tecnologia avançada. Agendamento online 24/7, avaliação gratuita e atendimento humanizado."
        keywords="dentista, odontologia, agendamento online, avaliação gratuita, sorriso inteligente, tecnologia dental"
        url="https://senhorsorrisso.com.br"
      />
      <div className="w-full min-h-screen bg-background overflow-x-hidden">
        <MainLayout>
          <div className="w-full overflow-x-hidden">
            <EnhancedHomePage />
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default Index;
