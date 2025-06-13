
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, MapPin, Activity, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
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
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const noShowAppointments = appointments.filter(apt => apt.status === 'no_show');
  const pendingAppointments = appointments.filter(apt => 
    !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status)
  );

  const statsData = [
    {
      icon: Activity,
      label: 'Total',
      value: appointments.length,
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      label: 'Hoje',
      value: todayAppointments.length,
      color: 'text-green-500'
    },
    {
      icon: CheckCircle,
      label: 'Confirmados',
      value: confirmedAppointments.length,
      color: 'text-green-600'
    },
    {
      icon: User,
      label: 'Concluídos',
      value: completedAppointments.length,
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Pendentes',
      value: pendingAppointments.length,
      color: 'text-yellow-500'
    },
    {
      icon: XCircle,
      label: 'Cancelados',
      value: cancelledAppointments.length,
      color: 'text-red-500'
    },
    {
      icon: AlertCircle,
      label: 'Não Compareceu',
      value: noShowAppointments.length,
      color: 'text-orange-500'
    },
    {
      icon: MapPin,
      label: 'Pacientes Únicos',
      value: new Set(appointments.map(apt => apt.phone)).size,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className={`${animations.fadeIn}`} style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
