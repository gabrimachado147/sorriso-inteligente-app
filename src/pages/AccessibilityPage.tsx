
import React from 'react';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const AccessibilityPage = () => {
  return (
    <>
      <PageHead
        title="Acessibilidade - Senhor Sorriso"
        description="Personalize sua experiência para melhor acessibilidade no aplicativo da rede Senhor Sorriso."
        keywords="acessibilidade, personalização, experiência usuário, inclusão digital, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/accessibility"
      />
      <div className={`space-y-6 ${animations.pageEnter}`}>
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold mobile-text-xl">Acessibilidade</h1>
          <p className="text-muted-foreground mobile-text-base mt-2">
            Personalize sua experiência para melhor acessibilidade
          </p>
        </div>
        <AccessibilityPanel />
      </div>
    </>
  );
};

export default AccessibilityPage;
