
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { BulkActions } from './BulkActions';
import { AppointmentTableHeader } from './AppointmentTableHeader';
import { EnhancedAppointmentRow } from './EnhancedAppointmentRow';
import { AppointmentTableFooter } from './AppointmentTableFooter';
import { Calendar } from 'lucide-react';
import { animations } from '@/lib/animations';

interface EnhancedAppointmentsTableProps {
  appointments: AppointmentRecord[];
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => void;
  onBulkStatusUpdate: (appointmentIds: string[], status: string) => void;
  onSendBulkMessage: (appointmentIds: string[], template: string) => void;
  isUpdating: boolean;
}

export const EnhancedAppointmentsTable: React.FC<EnhancedAppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  onServiceUpdate,
  onBulkStatusUpdate,
  onSendBulkMessage,
  isUpdating
}) => {
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(appointments.map(apt => apt.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const isAllSelected = appointments.length > 0 && selectedAppointments.length === appointments.length;
  const isPartiallySelected = selectedAppointments.length > 0 && selectedAppointments.length < appointments.length;

  if (appointments.length === 0) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-gray-600">Não há agendamentos para os filtros selecionados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <BulkActions
        selectedAppointments={selectedAppointments}
        appointments={appointments}
        onBulkStatusUpdate={onBulkStatusUpdate}
        onSendBulkMessage={onSendBulkMessage}
        onClearSelection={() => setSelectedAppointments([])}
      />

      <Card className={animations.fadeIn}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <AppointmentTableHeader
                isAllSelected={isAllSelected}
                isPartiallySelected={isPartiallySelected}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {appointments.map((appointment) => (
                  <EnhancedAppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    isSelected={selectedAppointments.includes(appointment.id)}
                    onSelect={handleSelectAppointment}
                    onStatusChange={onStatusChange}
                    onServiceUpdate={onServiceUpdate}
                    isUpdating={isUpdating}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AppointmentTableFooter
        totalAppointments={appointments.length}
        selectedCount={selectedAppointments.length}
      />
    </div>
  );
};
