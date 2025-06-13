
import React from 'react';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'avatar' | 'text' | 'button';
}

export const EnhancedSkeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-lg',
    avatar: 'h-12 w-12 rounded-full',
    text: 'h-4 rounded',
    button: 'h-10 w-24 rounded-md'
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
        'animate-pulse',
        variants[variant],
        className
      )}
    />
  );
};

// Skeleton específico para cards de serviços
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className={`space-y-3 p-4 border rounded-lg ${animations.fadeIn}`}>
      <EnhancedSkeleton variant="avatar" className="mx-auto" />
      <EnhancedSkeleton variant="text" className="w-3/4 mx-auto" />
      <EnhancedSkeleton variant="button" className="w-full" />
    </div>
  );
};

// Skeleton para cards de unidades
export const UnitCardSkeleton: React.FC = () => {
  return (
    <div className={`space-y-4 p-6 border rounded-lg ${animations.fadeIn}`}>
      <div className="flex items-start space-x-4">
        <EnhancedSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <EnhancedSkeleton className="w-3/4 h-5" />
          <EnhancedSkeleton className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <EnhancedSkeleton className="w-full" />
        <EnhancedSkeleton className="w-2/3" />
      </div>
      <div className="flex space-x-2">
        <EnhancedSkeleton variant="button" />
        <EnhancedSkeleton variant="button" />
      </div>
    </div>
  );
};

// Skeleton para lista de consultas
export const AppointmentSkeleton: React.FC = () => {
  return (
    <div className={`space-y-3 p-4 bg-gray-50 rounded-lg ${animations.fadeIn}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <EnhancedSkeleton className="w-3/4 h-5" />
          <EnhancedSkeleton className="w-1/2" />
          <EnhancedSkeleton className="w-1/3" />
        </div>
        <EnhancedSkeleton variant="button" className="ml-4" />
      </div>
    </div>
  );
};

// Skeleton para reviews
export const ReviewSkeleton: React.FC = () => {
  return (
    <div className={`space-y-3 p-3 bg-gray-50 rounded-lg ${animations.fadeIn}`}>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[1,2,3,4,5].map(i => (
            <EnhancedSkeleton key={i} className="w-4 h-4" />
          ))}
        </div>
        <EnhancedSkeleton className="w-20 h-4" />
      </div>
      <EnhancedSkeleton className="w-full h-4" />
      <EnhancedSkeleton className="w-3/4 h-4" />
    </div>
  );
};
