
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';
import { animations } from '@/lib/animations';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { PhoneConfirmationModal } from './PhoneConfirmationModal';
import { useAppointmentSchedulerLogicReal } from '@/hooks/useAppointmentSchedulerLogicReal';

interface AppointmentSchedulerRealProps {
  rescheduleId?: string | null;
}

const AppointmentSchedulerReal: React.FC<AppointmentSchedulerRealProps> = ({ rescheduleId = null }) => {
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
  } = useAppointmentSchedulerLogicReal(rescheduleId);

  const isFormComplete = selectedDate && selectedTime && selectedClinic && selectedService;

  return (
    <div className={`space-y-6 ${animations.pageEnter} overflow-x-hidden`}>
      <div className="flex items-center justify-between overflow-hidden">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center gap-2 mobile-touch-target flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl md:text-2xl font-bold mobile-text-xl truncate px-2">
          {rescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
        </h1>
        <div className="flex-shrink-0 w-6"></div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 py-2 overflow-hidden">
        <div className={`h-2 w-8 rounded-full mobile-transition flex-shrink-0 ${selectedDate ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`h-2 w-8 rounded-full mobile-transition flex-shrink-0 ${selectedTime ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`h-2 w-8 rounded-full mobile-transition flex-shrink-0 ${selectedClinic ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`h-2 w-8 rounded-full mobile-transition flex-shrink-0 ${selectedService ? 'bg-primary' : 'bg-gray-200'}`} />
      </div>

      {/* Form Steps */}
      <div className="space-y-6 overflow-x-hidden">
        {/* Date Selection */}
        <Card className={`${animations.slideInLeft} mobile-card-spacing overflow-hidden`}>
          <CardHeader className="pb-3 overflow-hidden">
            <CardTitle className="flex items-center gap-2 mobile-text-lg truncate">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="truncate">Escolha a Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DateSelector 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />
          </CardContent>
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card className={`${animations.slideInLeft} mobile-card-spacing overflow-hidden`}>
            <CardHeader className="pb-3 overflow-hidden">
              <CardTitle className="flex items-center gap-2 mobile-text-lg truncate">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="truncate">Escolha o Horário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <TimeSelector 
                selectedTime={selectedTime} 
                onTimeSelect={setSelectedTime} 
                selectedDate={selectedDate}
              />
            </CardContent>
          </Card>
        )}

        {/* Clinic Selection */}
        {selectedTime && (
          <Card className={`${animations.slideInLeft} mobile-card-spacing overflow-hidden`}>
            <CardHeader className="pb-3 overflow-hidden">
              <CardTitle className="flex items-center gap-2 mobile-text-lg truncate">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="truncate">Escolha a Clínica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <ClinicSelector 
                selectedClinic={selectedClinic} 
                onClinicSelect={setSelectedClinic}
                clinics={availableClinics}
              />
            </CardContent>
          </Card>
        )}

        {/* Service Selection */}
        {selectedClinic && (
          <Card className={`${animations.slideInLeft} mobile-card-spacing overflow-hidden`}>
            <CardHeader className="pb-3 overflow-hidden">
              <CardTitle className="flex items-center gap-2 mobile-text-lg truncate">
                <Stethoscope className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="truncate">Escolha o Serviço</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <ServiceSelector 
                selectedService={selectedService} 
                onServiceSelect={setSelectedService} 
              />
            </CardContent>
          </Card>
        )}

        {/* Summary and Confirm */}
        {isFormComplete && (
          <Card className={`${animations.slideInLeft} border-primary/20 bg-primary/5 mobile-card-spacing overflow-hidden`}>
            <CardHeader className="pb-3 overflow-hidden">
              <CardTitle className="text-primary mobile-text-lg truncate">Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mobile-text-sm overflow-hidden">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{selectedDate?.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2 overflow-hidden">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{availableClinics.find(c => c.id === selectedClinic)?.name}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2 overflow-hidden">
                  <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{selectedService}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleScheduleAppointment}
                className="w-full mt-6 mobile-button" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Agendando...' : (rescheduleId ? 'Confirmar Reagendamento' : 'Confirmar Agendamento')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Phone Confirmation Modal */}
      <PhoneConfirmationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onConfirm={handleConfirmAppointment}
        appointmentData={{
          date: selectedDate?.toLocaleDateString('pt-BR') || '',
          time: selectedTime,
          clinic: availableClinics.find(c => c.id === selectedClinic)?.name || '',
          service: selectedService
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AppointmentSchedulerReal;
