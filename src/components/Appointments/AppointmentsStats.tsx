
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, MapPin, Activity } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface AppointmentsStatsProps {
  appointments: AppointmentRecord[];
  isLoading: boolean;
}

export const AppointmentsStats: React.FC<AppointmentsStatsProps> = ({
  appointments,
  isLoading
}) => {
  if (isLoading) return null;

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className={animations.fadeIn}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={animations.fadeIn}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Hoje</p>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={animations.fadeIn}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Confirmados</p>
              <p className="text-2xl font-bold">{confirmedAppointments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={animations.fadeIn}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold">{cancelledAppointments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
