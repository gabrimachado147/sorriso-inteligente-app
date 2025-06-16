
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MobileLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'skeleton' | 'pulse';
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({
  className,
  size = 'md',
  text,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (variant === 'skeleton') {
    return (
      <div className={cn('mobile-skeleton', className)}>
        <div className="space-y-3">
          <div className="mobile-skeleton-text h-4 w-3/4"></div>
          <div className="mobile-skeleton-text h-4 w-1/2"></div>
          <div className="mobile-skeleton-button"></div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('mobile-loading bg-gray-200 rounded', className)}>
        {text && <span className="sr-only">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground mobile-text-sm">{text}</p>
      )}
    </div>
  );
};

// Componente para loading de página inteira
export const MobilePageLoading: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center mobile-container">
      <MobileLoading size="lg" text={text} />
    </div>
  );
};

// Componente para loading de botão
export const MobileButtonLoading: React.FC<{ className?: string }> = ({ className }) => {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
};
