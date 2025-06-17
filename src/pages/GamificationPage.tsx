
import React from 'react';
import { GamificationDashboard } from '@/components/Gamification/GamificationDashboard';
import { animations } from '@/lib/animations';

const GamificationPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mobile-text-xl">Suas Conquistas</h1>
        <p className="text-muted-foreground mobile-text-base mt-2">
          Acompanhe seu progresso e conquiste novos marcos
        </p>
      </div>
      <GamificationDashboard />
    </div>
  );
};

export default GamificationPage;
