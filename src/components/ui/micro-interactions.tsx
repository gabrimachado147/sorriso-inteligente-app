
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Heart, Sparkles, Zap } from 'lucide-react';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover-lift' | 'click-ripple' | 'success-pulse' | 'attention-shake';
  trigger?: 'hover' | 'click' | 'auto';
  className?: string;
  delay?: number;
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'hover-lift',
  trigger = 'hover',
  className,
  delay = 0
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (trigger === 'auto' && delay > 0) {
      const timer = setTimeout(() => {
        setIsActive(true);
        setHasTriggered(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const getAnimationClasses = () => {
    switch (type) {
      case 'hover-lift':
        return isActive 
          ? 'transform -translate-y-1 shadow-lg transition-all duration-200' 
          : 'transform translate-y-0 transition-all duration-200';
      case 'click-ripple':
        return isActive 
          ? 'transform scale-95 transition-transform duration-150' 
          : 'transform scale-100 transition-transform duration-150';
      case 'success-pulse':
        return isActive 
          ? 'animate-pulse border-green-300 bg-green-50 transition-all duration-300' 
          : 'transition-all duration-300';
      case 'attention-shake':
        return isActive 
          ? 'animate-[shake_0.5s_ease-in-out] transition-all' 
          : 'transition-all';
      default:
        return '';
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsActive(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 150);
    }
  };

  return (
    <div
      className={cn(getAnimationClasses(), className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// Componente para animações de sucesso
export const SuccessAnimation: React.FC<{ show: boolean; onComplete?: () => void }> = ({
  show,
  onComplete
}) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-[bounce_1s_ease-in-out] bg-green-500 text-white p-4 rounded-full shadow-xl">
        <CheckCircle className="h-8 w-8" />
      </div>
    </div>
  );
};

// Componente para feedback de carregamento
export const LoadingMicroInteraction: React.FC<{ 
  loading: boolean; 
  children: React.ReactNode;
  loadingText?: string;
}> = ({ loading, children, loadingText = "Carregando..." }) => {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{loadingText}</span>
          </div>
        </div>
      )}
      <div className={cn(loading && 'opacity-50')}>
        {children}
      </div>
    </div>
  );
};
