
import React from 'react';
import { HealthDashboard } from '@/components/Analytics/HealthDashboard';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

const AnalyticsPage = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <HealthDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
