
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { HomePage } from '@/components/Dashboard/HomePage';
import { PageHead } from '@/components/SEO/PageHead';

const Index = () => {
  return (
    <>
      <PageHead
        title="Senhor Sorriso - Clínica Odontológica Oficial"
        description="Aplicativo oficial da rede Senhor Sorriso. Agende consultas, chat com IA odontológica, avaliação gratuita e muito mais."
        keywords="Senhor Sorriso, clínica odontológica, dentista, agendamento online, chat IA, avaliação gratuita, saúde bucal"
        url="https://senhorsorrisso.com.br"
        type="website"
      />
      <MainLayout>
        <HomePage />
      </MainLayout>
    </>
  );
};

export default Index;
