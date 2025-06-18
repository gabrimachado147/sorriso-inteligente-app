
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Stethoscope, ArrowLeft } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentProgressIndicator } from './AppointmentProgressIndicator';
import { EnhancedDatePicker } from './EnhancedDatePicker';
import { TimeSlotGrid } from './TimeSlotGrid';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { PhoneConfirmationModal } from './PhoneConfirmationModal';
import { useAppointmentSchedulerLogicReal } from '@/hooks/useAppointmentSchedulerLogicReal';

interface OptimizedAppointmentSchedulerProps {
  rescheduleId?: string | null;
}

const OptimizedAppointmentScheduler: React.FC<OptimizedAppointmentSchedulerProps> = ({ 
  rescheduleId = null 
}) => {
  const [searchParams] = useSearchParams();
  const actualRescheduleId = rescheduleId || searchParams.get('reschedule');
  
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
    isFormValid,
    handleConfirmAppointment,
    handleScheduleAppointment,
    handleGoBack
  } = useAppointmentSchedulerLogicReal(actualRescheduleId);

  const steps = ['Data', 'Horário', 'Clínica', 'Serviço'];
  const currentStep = selectedDate ? (selectedTime ? (selectedClinic ? (selectedService ? 5 : 4) : 3) : 2) : 1;

  const selectedClinicData = availableClinics.find(c => c.id === selectedClinic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30">
      <div className={`safe-container mobile-container py-6 space-y-6 ${animations.pageEnter}`}>
        
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className={`flex items-center gap-2 ${animations.buttonHover}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {actualRescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Indicator */}
        <AppointmentProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          steps={steps}
        />

        {/* Main Content */}
        <div className="space-y-6">
          
          {/* Step 1: Date Selection */}
          <Card className={`${animations.slideInLeft} mobile-card-spacing`}>
            <CardHeader className="pb-3 text-center">
              <CardTitle className="flex items-center justify-center gap-2 mobile-text-lg">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <span>1. Escolha a Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDatePicker 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
            </CardContent>
          </Card>

          {/* Step 2: Time Selection */}
          {selectedDate && (
            <Card className={`${animations.slideInLeft} mobile-card-spacing`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="flex items-center justify-center gap-2 mobile-text-lg">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>2. Escolha o Horário</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSlotGrid 
                  selectedTime={selectedTime} 
                  onTimeSelect={setSelectedTime} 
                  selectedDate={selectedDate}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Clinic Selection */}
          {selectedTime && (
            <Card className={`${animations.slideInLeft} mobile-card-spacing`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="flex items-center justify-center gap-2 mobile-text-lg">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>3. Escolha a Clínica</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClinicSelector 
                  selectedClinic={selectedClinic} 
                  onClinicSelect={setSelectedClinic}
                  clinics={availableClinics}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Service Selection */}
          {selectedClinic && (
            <Card className={`${animations.slideInLeft} mobile-card-spacing`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="flex items-center justify-center gap-2 mobile-text-lg">
                  <Stethoscope className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>4. Escolha o Serviço</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceSelector 
                  selectedService={selectedService} 
                  onServiceSelect={setSelectedService} 
                />
              </CardContent>
            </Card>
          )}

          {/* Summary and Confirm */}
          {isFormValid && (
            <Card className={`${animations.scaleInBounce} border-primary/20 bg-gradient-to-r from-primary/5 to-green/5 mobile-card-spacing`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-primary mobile-text-lg">
                  ✓ Resumo do Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mobile-text-sm">
                  <div className="flex items-center justify-center gap-2 p-3 bg-white/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{selectedDate?.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white/50 rounded-lg">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white/50 rounded-lg md:col-span-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium truncate">{selectedClinicData?.name}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white/50 rounded-lg md:col-span-2">
                    <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium truncate">{selectedService}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleScheduleAppointment}
                  className={`w-full mt-6 mobile-button-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg ${animations.buttonHover}`}
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Agendando...
                    </div>
                  ) : (
                    actualRescheduleId ? 'Confirmar Reagendamento' : 'Confirmar Agendamento'
                  )}
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
            clinic: selectedClinicData?.name || '',
            service: selectedService
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default OptimizedAppointmentScheduler;
