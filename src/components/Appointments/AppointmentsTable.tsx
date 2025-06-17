import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Phone, Mail, DollarSign } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { ServiceEditor } from './ServiceEditor';

interface AppointmentsTableProps {
  appointments: AppointmentRecord[];
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  isUpdating: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'no_show':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmado';
    case 'cancelled':
      return 'Cancelado';
    case 'completed':
      return 'Concluído';
    case 'no_show':
      return 'Não Compareceu';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  onServiceUpdate,
  isUpdating
}) => {
  if (appointments.length === 0) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-600">
            Não há agendamentos que correspondam aos filtros selecionados.
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
                <TableHead>Serviço</TableHead>
                <TableHead>Clínica</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className={animations.fadeIn}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{appointment.name}</p>
                        <p className="text-sm text-gray-600">
                          ID: {appointment.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {appointment.phone}
                      </div>
                      {appointment.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {appointment.email}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{appointment.service}</p>
                        {typeof (appointment as AppointmentRecord & { price?: number }).price === 'number' && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <DollarSign className="h-3 w-3" />
                            R$ {((appointment as AppointmentRecord & { price?: number }).price as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>
                      <ServiceEditor
                        appointment={appointment}
                        onUpdate={onServiceUpdate}
                        isUpdating={isUpdating}
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{appointment.clinic}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={appointment.status}
                      onValueChange={(newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') =>
                        onStatusChange(appointment.id, newStatus)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="no_show">Não Compareceu</SelectItem>
                      </SelectContent>
                    </Select>
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
