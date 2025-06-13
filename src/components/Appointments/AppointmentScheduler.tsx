
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppointmentScheduler } from '@/hooks/useAppointmentScheduler';
import { CalendarIntegration } from '@/components/Calendar/CalendarIntegration';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { AppointmentSummary } from './AppointmentSummary';
import { Calendar, CheckCircle } from 'lucide-react';

export const AppointmentScheduler = () => {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { scheduleAppointment, loading, success } = useAppointmentScheduler();

  const handleSchedule = async () => {
    if (!selectedClinic || !selectedService || !selectedDate || !selectedTime) {
      return;
    }

    const appointmentData = {
      clinic_id: selectedClinic,
      service: selectedService,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      user_id: 'mock-user-id' // Em produção, vem do contexto de auth
    };

    const result = await scheduleAppointment(appointmentData);
    
    if (result.success) {
      setCurrentStep(5); // Ir para confirmação
    }
  };

  const resetForm = () => {
    setSelectedClinic('');
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setCurrentStep(1);
  };

  if (success && currentStep === 5) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação por WhatsApp.
          </p>
          <div className="space-y-4">
            <CalendarIntegration />
            <Button onClick={resetForm} variant="outline">
              Agendar Outro Horário
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendar Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ClinicSelector 
                selectedClinic={selectedClinic}
                onClinicSelect={setSelectedClinic}
                filteredClinics={[]}
              />
              <ServiceSelector 
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />
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
            
            <div>
              <AppointmentSummary
                clinic={selectedClinic}
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              onClick={handleSchedule}
              disabled={!selectedClinic || !selectedService || !selectedDate || !selectedTime || loading}
              className="px-8"
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
