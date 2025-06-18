
import React from 'react';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

interface LoadingMicroInteractionProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingMicroInteraction: React.FC<LoadingMicroInteractionProps> = ({
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'border-2 border-primary/20 border-t-primary rounded-full animate-spin',
        sizeClasses[size]
      )} />
    </div>
  );
};
