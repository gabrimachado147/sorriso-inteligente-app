
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Phone, User, MapPin, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { animations } from '@/lib/animations';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  created_at: string;
  source?: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  onStatusChange: (appointmentId: string, status: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  isUpdating: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    case 'completed': return 'bg-blue-500';
    case 'no_show': return 'bg-gray-500';
    default: return 'bg-yellow-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmado';
    case 'cancelled': return 'Cancelado';
    case 'completed': return 'Concluído';
    case 'no_show': return 'Não Compareceu';
    default: return 'Pendente';
  }
};

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  isUpdating
}) => {
  if (appointments.length === 0) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-500">
            Os agendamentos aparecerão aqui conforme forem criados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={animations.fadeIn}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agendamentos ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Clínica</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{appointment.name}</p>
                        {appointment.email && (
                          <p className="text-sm text-gray-500">{appointment.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{appointment.phone}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{appointment.clinic}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{appointment.service}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      {appointment.status === 'confirmed' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStatusChange(appointment.id, 'completed')}
                            disabled={isUpdating}
                            className="text-xs"
                          >
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onStatusChange(appointment.id, 'cancelled')}
                            disabled={isUpdating}
                            className="text-xs"
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'cancelled' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onStatusChange(appointment.id, 'confirmed')}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          Reativar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
