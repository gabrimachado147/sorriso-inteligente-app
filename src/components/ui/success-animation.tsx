
import React from 'react';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

interface SuccessAnimationProps {
  show: boolean;
  message: string;
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  message,
  className
}) => {
  if (!show) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
      animations.fadeIn,
      className
    )}>
      <div className={cn(
        'bg-white rounded-lg p-8 text-center shadow-xl max-w-sm mx-4',
        animations.scaleInBounce
      )}>
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sucesso!</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
