
import React from 'react';
import { HealthDashboard } from '@/components/Analytics/HealthDashboard';
import { animations } from '@/lib/animations';

const AnalyticsPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mobile-text-xl">Dashboard de Saúde</h1>
        <p className="text-muted-foreground mobile-text-base mt-2">
          Acompanhe seus indicadores de saúde bucal
        </p>
      </div>
      <HealthDashboard />
    </div>
  );
};

export default AnalyticsPage;
