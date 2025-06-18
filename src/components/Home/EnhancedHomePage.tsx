
import React from 'react';
import { animations } from '@/lib/animations';
import { EnhancedHeroSection } from './EnhancedHeroSection';
import { EnhancedServicesSection } from './EnhancedServicesSection';
import { EnhancedCTASection } from './EnhancedCTASection';
import { QuickActionsSection } from './QuickActionsSection';
import { PagePerformanceMonitor } from '@/components/Performance/PagePerformanceMonitor';

export const EnhancedHomePage: React.FC = () => {
  return (
    <div className={`min-h-screen ${animations.pageEnter}`}>
      <EnhancedHeroSection />
      <QuickActionsSection />
      <EnhancedServicesSection />
      <EnhancedCTASection />
      
      {/* Monitor de performance (apenas em desenvolvimento) */}
      <PagePerformanceMonitor />
    </div>
  );
};

export default EnhancedHomePage;
