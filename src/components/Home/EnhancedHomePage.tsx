
import React from 'react';
import { animations } from '@/lib/animations';
import { EnhancedHeroSection } from './EnhancedHeroSection';
import { EnhancedServicesSection } from './EnhancedServicesSection';
import { EnhancedCTASection } from './EnhancedCTASection';
import { QuickActionsSection } from './QuickActionsSection';

export const EnhancedHomePage: React.FC = () => {
  return (
    <div className={`min-h-screen ${animations.pageEnter}`}>
      <EnhancedHeroSection />
      <QuickActionsSection />
      <EnhancedServicesSection />
      <EnhancedCTASection />
    </div>
  );
};

export default EnhancedHomePage;
