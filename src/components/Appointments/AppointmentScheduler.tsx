
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { Calendar as CalendarIcon } from 'lucide-react';
import { animations } from '@/lib/animations';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { AppointmentSummary } from './AppointmentSummary';
import { RescheduleNotification } from './RescheduleNotification';
import { SmartSuggestions } from './SmartSuggestions';
import { PhoneConfirmationModal } from './PhoneConfirmationModal';
import { availableServices } from './constants/services';
import { useAppointmentSchedulerLogic } from '@/hooks/useAppointmentSchedulerLogic';

const AppointmentScheduler = () => {
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('reschedule');
  
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedClinic,
    setSelectedClinic,
    selectedService,
    setSelectedService,
    isLoading,
    showPhoneModal,
    setShowPhoneModal,
    availableClinics,
    handleConfirmAppointment,
    handleScheduleAppointment,
    handleGoBack
  } = useAppointmentSchedulerLogic(rescheduleId);

  const handleServiceSuggestion = (serviceName: string) => {
    const service = availableServices.find(s => s.name === serviceName);
    if (service) {
      setSelectedService(service.id);
    }
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <div className={`p-6 space-y-6 ${animations.fadeIn}`}>
        <EnhancedSkeleton variant="appointment-card" count={3} />
      </div>
    );
  }

  const selectedClinicData = availableClinics.find(c => c.id === selectedClinic);
  const selectedServiceData = availableServices.find(s => s.id === selectedService);

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          {rescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
        </h1>
        <Button variant="outline" onClick={handleGoBack} className={animations.buttonHover}>
          Voltar
        </Button>
      </div>

      {rescheduleId && (
        <RescheduleNotification rescheduleId={rescheduleId} />
      )}

      {/* Sugestões Inteligentes */}
      <SmartSuggestions
        selectedDate={selectedDate}
        onTimeSelect={setSelectedTime}
        onServiceSelect={handleServiceSuggestion}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateSelector 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        <TimeSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      </div>

      <ClinicSelector
        selectedClinic={selectedClinic}
        onClinicSelect={setSelectedClinic}
        filteredClinics={availableClinics}
      />

      <ServiceSelector
        selectedService={selectedService}
        onServiceSelect={setSelectedService}
        filteredServices={availableServices}
      />

      <AppointmentSummary
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedClinic={selectedClinic}
        selectedService={selectedService}
        availableClinics={availableClinics}
        availableServices={availableServices}
        onConfirm={handleScheduleAppointment}
      />

      {/* Modal de Confirmação com Nome e Telefone */}
      <PhoneConfirmationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onConfirm={handleConfirmAppointment}
        appointmentData={{
          date: selectedDate ? selectedDate.toLocaleDateString('pt-BR') : '',
          time: selectedTime,
          clinic: selectedClinicData?.name ? `${selectedClinicData.name} - ${selectedClinicData.city}` : '',
          service: selectedServiceData?.name || ''
        }}
      />
    </div>
  );
};

export default AppointmentScheduler;
