
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { EmptyAppointmentsState } from './EmptyAppointmentsState';
import { AppointmentRow } from './AppointmentRow';

interface AppointmentsTableProps {
  appointments: AppointmentRecord[];
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  onDelete?: (appointmentId: string) => void;
  isUpdating: boolean;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  onServiceUpdate,
  onDelete,
  isUpdating
}) => {
  if (appointments.length === 0) {
    return <EmptyAppointmentsState />;
  }

  return (
    <Card className={`${animations.fadeIn} w-full overflow-hidden`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Agendamentos ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Paciente</TableHead>
                <TableHead className="min-w-[130px]">Contato</TableHead>
                <TableHead className="min-w-[120px]">Data/Hora</TableHead>
                <TableHead className="min-w-[120px]">Serviço</TableHead>
                <TableHead className="min-w-[100px]">Clínica</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onStatusChange={onStatusChange}
                  onServiceUpdate={onServiceUpdate}
                  onDelete={onDelete}
                  isUpdating={isUpdating}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
