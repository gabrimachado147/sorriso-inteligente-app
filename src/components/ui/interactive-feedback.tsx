
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveFeedbackProps {
  children: React.ReactNode;
  className?: string;
  feedbackType?: 'scale' | 'glow' | 'ripple';
  disabled?: boolean;
}

export const InteractiveFeedback: React.FC<InteractiveFeedbackProps> = ({
  children,
  className,
  feedbackType = 'scale',
  disabled = false
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) setIsActive(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsActive(false);
  };

  const handleMouseLeave = () => {
    if (!disabled) setIsActive(false);
  };

  const getFeedbackClasses = () => {
    switch (feedbackType) {
      case 'scale':
        return isActive 
          ? 'transform scale-95 transition-transform duration-150' 
          : 'transform scale-100 transition-transform duration-150 hover:scale-105';
      case 'glow':
        return isActive 
          ? 'shadow-lg shadow-primary/25 transition-shadow duration-150' 
          : 'hover:shadow-md hover:shadow-primary/15 transition-shadow duration-150';
      case 'ripple':
        return isActive 
          ? 'bg-primary/10 transition-colors duration-150' 
          : 'hover:bg-primary/5 transition-colors duration-150';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        getFeedbackClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
