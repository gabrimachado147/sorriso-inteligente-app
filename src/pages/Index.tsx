
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { LazyHomePage } from '@/components/Dashboard/LazyHomePage';
import { PageHead } from '@/components/SEO/PageHead';

const Index = () => {
  return (
    <>
      <PageHead
        title="Senhor Sorriso - Clínica Odontológica"
        description="Aplicativo oficial da rede Senhor Sorriso - Agendamento online, chat IA e avaliação gratuita"
        keywords="dentista, odontologia, agendamento, consulta, dentes, sorriso, saúde bucal"
        url="https://senhorsorrisso.com.br"
      />
      <div className="w-full min-h-screen bg-background overflow-x-hidden">
        <MainLayout>
          <div className="w-full overflow-x-hidden">
            <LazyHomePage />
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default Index;
