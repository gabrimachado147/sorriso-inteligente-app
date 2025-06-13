import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppointmentScheduler } from '@/hooks/useAppointmentScheduler';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCalendar } from '@/hooks/useCalendar';
import { ReminderService } from '@/services/reminders';
import { toastSuccess } from '@/components/ui/custom-toast';
import { ClinicSelector } from './ClinicSelector';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { ServiceSelector } from './ServiceSelector';
import { CalendarIntegration } from '@/components/Calendar/CalendarIntegration';
import { NearbyClinicas } from '@/components/Location/NearbyClinicas';
import { ReminderSettings } from '@/components/Reminders/ReminderSettings';
import { Calendar, MapPin, Bell, CheckCircle } from 'lucide-react';

interface AppointmentData {
  clinic: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
}

const AppointmentScheduler = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    clinic: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const { scheduleAppointment, isLoading } = useAppointmentScheduler();
  const { trackEvent } = useAnalytics();
  const { syncAppointment } = useCalendar();

  const handleScheduleAppointment = async (appointmentData: any) => {
    try {
      const result = await scheduleAppointment(appointmentData);
      
      // Criar lembretes para o agendamento
      if (result?.id) {
        await ReminderService.createRemindersForAppointment(result.id);
        
        // Sincronizar com calendário se configurado
        const userId = 'current_user_id'; // Obter do contexto de auth
        await syncAppointment.mutateAsync({
          appointment: result,
          userId
        });

        // Track analytics event
        trackEvent('appointment_scheduled', {
          clinic: appointmentData.clinic,
          service: appointmentData.service,
          date: appointmentData.date
        });

        toastSuccess('Agendamento confirmado!', 'Lembretes automáticos foram configurados');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
          <p className="text-gray-600">
            Escolha a clínica, data e horário que melhor se adequam à sua rotina
          </p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendar
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Próximas
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Lembretes
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Calendário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ClinicSelector />
                <ServiceSelector />
                <DateSelector />
                <TimeSelector />
                
                <Button 
                  onClick={handleScheduleAppointment} 
                  className="w-full"
                  size="lg"
                >
                  Confirmar Agendamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nearby">
            <NearbyClinicas />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderSettings />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
