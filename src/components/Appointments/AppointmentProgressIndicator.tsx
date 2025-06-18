
import React from 'react';
import { Check } from 'lucide-react';
import { animations } from '@/lib/animations';

interface AppointmentProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const AppointmentProgressIndicator: React.FC<AppointmentProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps
}) => {
  return (
    <div className={`w-full max-w-3xl mx-auto p-4 ${animations.fadeInUp}`}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : isCurrent
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 text-gray-400'
                  } ${animations.scaleIn}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  isCurrent ? 'text-primary font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? 'bg-primary' : 'bg-gray-300'
                } transition-colors duration-300`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
