
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { animations } from '@/lib/animations';

export const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={`text-center space-y-4 ${animations.fadeIn}`}>
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg">
          <img 
            src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
            alt="Senhor Sorriso Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-primary">
        Senhor Sorriso
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Cuidando do seu sorriso com carinho e profissionalismo. 
        Agendamentos fáceis, atendimento de qualidade.
      </p>
      {user && (
        <p className="text-lg text-primary font-medium">
          Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
        </p>
      )}
    </div>
  );
};
