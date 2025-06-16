
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { animations, microAnimations } from '@/lib/animations';

export const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={`text-center space-y-6 mobile-card-spacing ${microAnimations.heroSection}`}>
      <div className="flex justify-center mb-6">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg mobile-scale-in ${animations.scaleInBounce}`}
             style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <img 
            src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
            alt="Senhor Sorriso Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className={`text-2xl md:text-4xl font-bold text-primary mobile-text-xl leading-tight ${animations.fadeInUp}`}
           style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          Senhor Sorriso
        </h1>
        
        <p className={`text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mobile-text-base px-4 ${animations.fadeInUp}`}
           style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          Cuidando do seu sorriso com carinho e profissionalismo. 
          Agendamentos fáceis, atendimento de qualidade.
        </p>
      </div>
      
      {user && (
        <div className={`bg-primary/10 mobile-card-spacing rounded-lg inline-block mobile-scale-in ${animations.fadeInUp}`}
             style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <p className="text-lg text-primary font-medium mobile-text-base">
            Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
          </p>
        </div>
      )}
    </div>
  );
};
