
import React from 'react';
import { GamificationDashboard } from '@/components/Gamification/GamificationDashboard';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

const GamificationPage = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <GamificationDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default GamificationPage;
