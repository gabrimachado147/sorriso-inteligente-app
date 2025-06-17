
import React from 'react';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';
import { animations } from '@/lib/animations';

const AccessibilityPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mobile-text-xl">Acessibilidade</h1>
        <p className="text-muted-foreground mobile-text-base mt-2">
          Personalize sua experiência para melhor acessibilidade
        </p>
      </div>
      <AccessibilityPanel />
    </div>
  );
};

export default AccessibilityPage;
