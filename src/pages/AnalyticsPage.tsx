
import React from 'react';
import { HealthDashboard } from '@/components/Analytics/HealthDashboard';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const AnalyticsPage = () => {
  return (
    <>
      <PageHead
        title="Dashboard de Saúde - Senhor Sorriso"
        description="Acompanhe seus indicadores de saúde bucal e histórico de tratamentos na rede Senhor Sorriso."
        keywords="dashboard saúde, indicadores saúde bucal, histórico tratamentos, análise odontológica, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/analytics"
      />
      <div className={`space-y-6 ${animations.pageEnter}`}>
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold mobile-text-xl">Dashboard de Saúde</h1>
          <p className="text-muted-foreground mobile-text-base mt-2">
            Acompanhe seus indicadores de saúde bucal
          </p>
        </div>
        <HealthDashboard />
      </div>
    </>
  );
};

export default AnalyticsPage;
