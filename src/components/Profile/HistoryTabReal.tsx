
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useRealUserAppointments } from '@/hooks/useRealUserAppointments';
import { AppointmentActions } from '@/components/Appointments/AppointmentActions';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const HistoryTabReal: React.FC = () => {
  const { appointments, loading, refetch } = useRealUserAppointments();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-500">
            Seus agendamentos aparecerão aqui após serem criados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Histórico de Consultas</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {appointments.length} consulta{appointments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className={`${animations.slideInLeft} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {appointment.service}
                </CardTitle>
                <AppointmentActions
                  appointment={appointment}
                  onUpdate={refetch}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(parseISO(appointment.date), 'PPP', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.clinic}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="h-4 w-4" />
                  <span>{appointment.service}</span>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Observações:</strong> {appointment.notes}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                <span>
                  Criado em {format(parseISO(appointment.created_at), 'PPp', { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
