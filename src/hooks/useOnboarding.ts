
import { useState, useEffect } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Senhor Sorriso!',
    description: 'Vamos te guiar pelos principais recursos do app',
  },
  {
    id: 'schedule',
    title: 'Agende sua consulta',
    description: 'Toque aqui para agendar uma avaliação gratuita',
    target: '[data-onboarding="schedule-button"]',
    action: 'appointments'
  },
  {
    id: 'chat',
    title: 'Chat com IA',
    description: 'Tire suas dúvidas com nosso assistente virtual',
    target: '[data-onboarding="chat-button"]',
    action: 'chat'
  },
  {
    id: 'units',
    title: 'Nossas Unidades',
    description: 'Encontre a clínica mais próxima de você',
    target: '[data-onboarding="units-button"]',
    action: 'locations'
  },
  {
    id: 'emergency',
    title: 'Atendimento de Emergência',
    description: 'Para urgências, use este botão para contato 24h',
    target: '[data-onboarding="emergency-button"]',
  }
];

export const useOnboarding = () => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    if (!completed) {
      setIsOnboardingActive(true);
    } else {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const restartOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('onboarding-completed');
  };

  return {
    isOnboardingActive,
    currentStep,
    currentStepData: onboardingSteps[currentStep],
    totalSteps: onboardingSteps.length,
    hasCompletedOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    restartOnboarding
  };
};
