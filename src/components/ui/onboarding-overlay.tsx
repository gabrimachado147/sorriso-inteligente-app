
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface OnboardingOverlayProps {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  stepData: {
    id: string;
    title: string;
    description: string;
    target?: string;
    action?: string;
  };
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  isActive,
  currentStep,
  totalSteps,
  stepData,
  onNext,
  onPrev,
  onSkip,
  onComplete
}) => {
  const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (isActive && stepData.target) {
      const targetElement = document.querySelector(stepData.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        
        // Highlight do elemento
        targetElement.classList.add('onboarding-highlight');
        
        return () => {
          targetElement.classList.remove('onboarding-highlight');
        };
      }
    }
  }, [isActive, stepData.target]);

  if (!isActive) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={`fixed inset-0 z-50 ${animations.modalEnter}`}>
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Spotlight para elemento target */}
      {targetPosition && (
        <div
          className="absolute border-4 border-primary rounded-lg animate-pulse"
          style={{
            top: targetPosition.top - 8,
            left: targetPosition.left - 8,
            width: targetPosition.width + 16,
            height: targetPosition.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Card de instrução */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
        <Card className={`${animations.scaleIn} bg-white dark:bg-gray-800 shadow-2xl`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{stepData.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-1 mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index <= currentStep ? 'bg-primary flex-1' : 'bg-gray-200 w-2'
                  )}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{stepData.description}</p>
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrev}
                    className={animations.buttonHover}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className={animations.buttonHover}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Pular Tutorial
                </Button>
              </div>
              
              <Button
                onClick={isLastStep ? onComplete : onNext}
                className={animations.buttonHover}
              >
                {isLastStep ? 'Finalizar' : 'Próximo'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
