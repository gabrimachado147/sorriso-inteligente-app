
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Heart } from 'lucide-react';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dental' | 'minimal';
  text?: string;
  className?: string;
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  size = 'md', 
  variant = 'default',
  text,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (variant === 'dental') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
        <div className="relative">
          <Heart className={cn(
            'text-primary animate-pulse',
            sizeClasses[size]
          )} />
          <div className={cn(
            'absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin',
            sizeClasses[size]
          )} />
        </div>
        {text && (
          <p className={cn('text-primary font-medium animate-pulse', textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <span className={cn('text-muted-foreground', textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-primary',
          sizeClasses[size]
        )} />
        <div className={cn(
          'absolute inset-2 bg-primary/20 rounded-full animate-pulse',
          size === 'sm' ? 'inset-1' : size === 'lg' ? 'inset-3' : 'inset-2'
        )} />
      </div>
      {text && (
        <p className={cn('text-primary font-medium animate-fade-in', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

// Loading específico para botões
interface ButtonLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ text = 'Carregando...', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={cn('animate-spin', iconSizes[size])} />
      <span>{text}</span>
    </div>
  );
};
