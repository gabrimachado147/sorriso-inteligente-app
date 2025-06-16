
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
    <div className={`min-h-screen bg-gradient-to-br from-primary/5 to-background p-4 ${animations.pageEnter}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            {rescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`h-2 w-8 rounded-full ${selectedDate ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`h-2 w-8 rounded-full ${selectedTime ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`h-2 w-8 rounded-full ${selectedClinic ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`h-2 w-8 rounded-full ${selectedService ? 'bg-primary' : 'bg-gray-200'}`} />
        </div>

        {/* Form Steps */}
        <div className="space-y-6">
          {/* Date Selection */}
          <Card className={animations.slideInLeft}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Escolha a Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateSelector 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
            </CardContent>
          </Card>

          {/* Time Selection */}
          {selectedDate && (
            <Card className={animations.slideInLeft}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Escolha o Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
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
            <Card className={animations.slideInLeft}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Escolha a Clínica
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

          {/* Service Selection */}
          {selectedClinic && (
            <Card className={animations.slideInLeft}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Escolha o Serviço
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
          {isFormComplete && (
            <Card className={`${animations.slideInLeft} border-primary/20 bg-primary/5`}>
              <CardHeader>
                <CardTitle className="text-primary">Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{selectedDate?.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{availableClinics.find(c => c.id === selectedClinic)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>{selectedService}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleScheduleAppointment}
                  className="w-full mt-6" 
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
          appointmentDetails={{
            date: selectedDate?.toLocaleDateString('pt-BR') || '',
            time: selectedTime,
            clinic: availableClinics.find(c => c.id === selectedClinic)?.name || '',
            service: selectedService
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AppointmentSchedulerReal;
