
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveFeedbackProps {
  children: React.ReactNode;
  feedbackType?: 'ripple' | 'scale' | 'glow' | 'bounce';
  className?: string;
  disabled?: boolean;
}

export const InteractiveFeedback: React.FC<InteractiveFeedbackProps> = ({
  children,
  feedbackType = 'ripple',
  className,
  disabled = false
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const getFeedbackClasses = (): string => {
    if (disabled) return 'opacity-50 cursor-not-allowed';

    const baseClasses = 'transition-all duration-200 cursor-pointer';
    
    switch (feedbackType) {
      case 'ripple':
        return `${baseClasses} ${isActive ? 'transform scale-95' : 'hover:shadow-md'}`;
      case 'scale':
        return `${baseClasses} ${isActive ? 'transform scale-95' : 'hover:scale-105'}`;
      case 'glow':
        return `${baseClasses} ${isActive ? 'shadow-lg ring-2 ring-primary/20' : 'hover:shadow-md'}`;
      case 'bounce':
        return `${baseClasses} ${isActive ? 'animate-bounce' : 'hover:-translate-y-1'}`;
      default:
        return baseClasses;
    }
  };

  return (
    <div
      className={cn(getFeedbackClasses(), className)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </div>
  );
};
