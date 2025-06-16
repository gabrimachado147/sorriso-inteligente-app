
import React from 'react';
import { HealthDashboard } from '@/components/Analytics/HealthDashboard';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mobile-text-xl">Dashboard de Saúde</h1>
          <p className="text-muted-foreground mobile-text-base">
            Acompanhe seus indicadores de saúde bucal
          </p>
        </div>
        <HealthDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
