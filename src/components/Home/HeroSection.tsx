
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { animations, microAnimations } from '@/lib/animations';

export const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={`text-center space-y-6 px-4 py-8 ${microAnimations.heroSection}`}>
      <div className="flex justify-center mb-8">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg ${animations.scaleInBounce}`}
             style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <img 
            src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
            alt="Senhor Sorriso Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className={animations.fadeInUp} style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
          Senhor Sorriso
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <p className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mobile-text-base ${animations.fadeInUp}`}
         style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
        Cuidando do seu sorriso com carinho e profissionalismo. 
        Agendamentos fáceis, atendimento de qualidade.
      </p>
      
      {user && (
        <div className={`bg-primary/10 px-6 py-3 rounded-lg inline-block mobile-card-spacing ${animations.fadeInUp}`}
             style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <p className="text-lg text-primary font-medium mobile-text-base">
            Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
          </p>
        </div>
      )}
    </div>
  );
};
