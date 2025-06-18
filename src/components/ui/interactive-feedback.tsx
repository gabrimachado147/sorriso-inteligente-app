
import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveFeedbackProps {
  children: React.ReactNode;
  feedbackType?: 'scale' | 'glow' | 'ripple';
  className?: string;
}

export const InteractiveFeedback: React.FC<InteractiveFeedbackProps> = ({
  children,
  feedbackType = 'scale',
  className
}) => {
  const feedbackClasses = {
    scale: 'transform transition-transform duration-200 hover:scale-105 active:scale-95',
    glow: 'transition-all duration-300 hover:shadow-lg hover:shadow-primary/20',
    ripple: 'relative overflow-hidden transition-all duration-200 hover:bg-primary/5'
  };

  return (
    <div className={cn(feedbackClasses[feedbackType], className)}>
      {children}
    </div>
  );
};
