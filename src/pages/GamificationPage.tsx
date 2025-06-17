
import React from 'react';
import { GamificationDashboard } from '@/components/Gamification/GamificationDashboard';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const GamificationPage = () => {
  return (
    <>
      <PageHead
        title="Suas Conquistas - Senhor Sorriso"
        description="Acompanhe seu progresso e conquiste novos marcos na sua jornada de saúde bucal com a rede Senhor Sorriso."
        keywords="conquistas, gamificação, progresso saúde bucal, marcos odontológicos, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/gamification"
      />
      <div className={`space-y-6 ${animations.pageEnter}`}>
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold mobile-text-xl">Suas Conquistas</h1>
          <p className="text-muted-foreground mobile-text-base mt-2">
            Acompanhe seu progresso e conquiste novos marcos
          </p>
        </div>
        <GamificationDashboard />
      </div>
    </>
  );
};

export default GamificationPage;
