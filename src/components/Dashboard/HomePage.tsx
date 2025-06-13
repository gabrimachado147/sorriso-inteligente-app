
import React from 'react';
import { toastSuccess, toastInfo, toastAppointment, toastCall } from '@/components/ui/custom-toast';
import { useAppointmentScheduler } from '@/hooks/useAppointmentScheduler';
import { useChatHandler } from '@/hooks/useChatHandler';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAutoTheme } from '@/hooks/useAutoTheme';
import { animations } from '@/lib/animations';
import { HeroSection } from './HeroSection';
import { QuickActions } from './QuickActions';
import { UnitsSection } from './UnitsSection';
import { AppointmentsSection } from './AppointmentsSection';
import { ServicesGrid } from './ServicesGrid';
import { ReviewsSection } from './ReviewsSection';
import { EmergencyContact } from './EmergencyContact';
import { OnboardingOverlay } from '@/components/ui/onboarding-overlay';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { scheduleAppointment, loading: schedulingLoading } = useAppointmentScheduler();
  const { sendWhatsAppMessage, loading: chatLoading } = useChatHandler();
  const { theme, currentTheme, changeTheme } = useAutoTheme();
  const {
    isOnboardingActive,
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding
  } = useOnboarding();

  const handleScheduleEvaluation = async () => {
    try {
      toastAppointment("Agendamento", "Redirecionando para avaliação gratuita...");
      onNavigate('appointments');
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  const handleViewUnits = () => {
    toastInfo("Unidades", "Carregando mapa de clínicas...");
    onNavigate('locations');
  };

  const handleOpenChat = async () => {
    try {
      toastInfo("Chat IA", "Iniciando conversa com assistente virtual...");
      onNavigate('chat');
    } catch (error) {
      console.error('Erro ao abrir chat:', error);
    }
  };

  const handleEmergencyCall = async () => {
    try {
      const message = encodeURIComponent("URGÊNCIA DENTAL: Preciso de atendimento de emergência. Por favor, me orientem sobre o procedimento.");
      window.open(`https://wa.me/5531971147487?text=${message}`, '_blank');
      toastCall("Emergência", "Conectando com atendimento de urgência...");
    } catch (error) {
      console.error('Erro ao chamar emergência:', error);
      window.open('tel:+5531971147487', '_self');
    }
  };

  const handleQuickAction = (action: string) => {
    // Se estiver no onboarding e a ação corresponder, avançar o step
    if (isOnboardingActive && currentStepData?.action === action) {
      nextStep();
    }

    switch (action) {
      case 'chat':
        handleOpenChat();
        break;
      case 'locations':
        handleViewUnits();
        break;
      case 'appointments':
        handleScheduleEvaluation();
        break;
      case 'emergency':
        handleEmergencyCall();
        break;
      default:
        toastInfo("Ação", `Executando: ${action}`);
    }
  };

  const handleScheduleClinic = async (clinic: string, phone: string) => {
    try {
      const message = encodeURIComponent(`Olá! Gostaria de agendar uma consulta na unidade ${clinic}. Poderiam me informar os horários disponíveis?`);
      window.open(`https://wa.me/5531971147487?text=${message}`, '_blank');
      toastAppointment("Agendamento", `Solicitação enviada para ${clinic}`);
    } catch (error) {
      console.error('Erro ao contatar clínica:', error);
      onNavigate('appointments');
    }
  };

  const handleReschedule = () => {
    toastInfo("Reagendamento", "Redirecionando para reagendamento...");
    onNavigate('profile');
  };

  const handleViewAllAppointments = () => {
    toastInfo("Consultas", "Carregando histórico de consultas...");
    onNavigate('profile');
  };

  const handleServiceSelect = (service: string) => {
    toastAppointment("Serviço", `Selecionando ${service}...`);
    onNavigate('appointments');
  };

  return (
    <div className={`p-4 space-y-6 max-w-7xl mx-auto ${animations.pageEnter}`}>
      {/* Hero Section */}
      <HeroSection 
        onScheduleEvaluation={handleScheduleEvaluation}
        onViewUnits={handleViewUnits}
        schedulingLoading={schedulingLoading}
      />

      {/* Quick Actions */}
      <QuickActions onQuickAction={handleQuickAction} />

      {/* Nossas Unidades */}
      <UnitsSection 
        onViewUnits={handleViewUnits}
        onScheduleClinic={handleScheduleClinic}
      />

      {/* Próximas Consultas */}
      <AppointmentsSection 
        onReschedule={handleReschedule}
        onViewAllAppointments={handleViewAllAppointments}
      />

      {/* Nossos Serviços */}
      <ServicesGrid onServiceSelect={handleServiceSelect} />

      {/* Avaliações */}
      <ReviewsSection />

      {/* Contato de Emergência */}
      <EmergencyContact 
        onEmergencyCall={handleEmergencyCall}
        chatLoading={chatLoading}
      />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isActive={isOnboardingActive}
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepData={currentStepData}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipOnboarding}
        onComplete={completeOnboarding}
      />
    </div>
  );
};
