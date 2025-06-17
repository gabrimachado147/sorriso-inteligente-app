
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { User, MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { AppointmentContactInfo } from './AppointmentContactInfo';
import { AppointmentDateTime } from './AppointmentDateTime';
import { AppointmentServiceInfo } from './AppointmentServiceInfo';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';

interface AppointmentRowProps {
  appointment: AppointmentRecord;
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  onDelete?: (appointmentId: string) => void;
  isUpdating: boolean;
}

export const AppointmentRow: React.FC<AppointmentRowProps> = ({
  appointment,
  onStatusChange,
  onServiceUpdate,
  onDelete,
  isUpdating
}) => {
  return (
    <TableRow className={animations.fadeIn}>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{appointment.name}</p>
            <p className="text-sm text-gray-600 truncate">
              ID: {appointment.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <AppointmentContactInfo
          phone={appointment.phone}
          email={appointment.email}
        />
      </TableCell>

      <TableCell>
        <AppointmentDateTime
          date={appointment.date}
          time={appointment.time}
        />
      </TableCell>

      <TableCell>
        <AppointmentServiceInfo
          appointment={appointment}
          onServiceUpdate={onServiceUpdate}
          isUpdating={isUpdating}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <p className="text-sm truncate">{appointment.clinic}</p>
        </div>
      </TableCell>

      <TableCell>
        <AppointmentStatusBadge
          status={appointment.status}
          appointmentId={appointment.id}
          onStatusChange={onStatusChange}
          isUpdating={isUpdating}
        />
      </TableCell>
    </TableRow>
  );
};
