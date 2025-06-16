
import React from 'react';
import { GamificationDashboard } from '@/components/Gamification/GamificationDashboard';

const GamificationPage = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mobile-text-xl">Seus Conquistas</h1>
          <p className="text-muted-foreground mobile-text-base">
            Acompanhe seu progresso e conquiste novos marcos
          </p>
        </div>
        <GamificationDashboard />
      </div>
    </div>
  );
};

export default GamificationPage;
