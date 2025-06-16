
import React from 'react';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';

const AccessibilityPage = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mobile-text-xl">Acessibilidade</h1>
          <p className="text-muted-foreground mobile-text-base">
            Personalize sua experiência para melhor acessibilidade
          </p>
        </div>
        <AccessibilityPanel />
      </div>
    </div>
  );
};

export default AccessibilityPage;
