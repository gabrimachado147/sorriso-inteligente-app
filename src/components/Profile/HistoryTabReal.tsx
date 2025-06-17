
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
      <div className="space-y-4 overflow-x-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden">
            <div className="h-32 bg-gray-200 rounded mobile-card-spacing"></div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className={`${animations.fadeIn} mobile-card-spacing overflow-hidden`}>
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2 mobile-text-lg">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-500 mobile-text-base px-4">
            Seus agendamentos aparecerão aqui após serem criados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden pb-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold truncate flex-1">Histórico de Consultas</h3>
        <Badge variant="secondary" className="px-3 py-1 mobile-text-sm flex-shrink-0 bg-gray-100 text-gray-800">
          {appointments.length} consulta{appointments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4 overflow-x-hidden">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className={`${animations.slideInLeft} hover:shadow-md transition-shadow mobile-card-spacing overflow-hidden`}>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <CardTitle className="text-lg mobile-text-lg truncate flex-1 min-w-0">
                  {appointment.service}
                </CardTitle>
                <div className="flex-shrink-0 w-full sm:w-auto overflow-x-auto">
                  <AppointmentActions
                    appointment={appointment}
                    onUpdate={refetch}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 mobile-text-sm min-w-0">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {format(parseISO(appointment.date), 'PPP', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mobile-text-sm min-w-0">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mobile-text-sm md:col-span-2 min-w-0">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{appointment.clinic}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mobile-text-sm md:col-span-2 min-w-0">
                  <Stethoscope className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{appointment.service}</span>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md overflow-hidden">
                  <p className="text-sm text-gray-700 mobile-text-sm break-words">
                    <strong>Observações:</strong> {appointment.notes}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 mobile-text-xs">
                <span className="truncate">
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
