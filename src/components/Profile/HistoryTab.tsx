
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, History } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useUserAppointments } from '@/hooks/useUserAppointments';

export const HistoryTab = () => {
  const { appointments } = useUserAppointments();

  return (
    <div className="space-y-6">
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Você ainda não tem consultas agendadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{appointment.service}</h4>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'completed' ? 'secondary' :
                      appointment.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {appointment.status === 'confirmed' ? 'Confirmado' :
                       appointment.status === 'completed' ? 'Concluído' :
                       appointment.status === 'cancelled' ? 'Cancelado' : appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.clinic}</p>
                  <p className="text-sm text-gray-600">{appointment.date} às {appointment.time}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
