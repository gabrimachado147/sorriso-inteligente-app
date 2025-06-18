
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentServiceInfo } from './AppointmentServiceInfo';
import { Phone, Mail, Calendar, Clock, User } from 'lucide-react';
import { simplifyClinicName } from './utils/clinicNameUtils';

interface EnhancedAppointmentRowProps {
  appointment: AppointmentRecord;
  isSelected: boolean;
  onSelect: (appointmentId: string, checked: boolean) => void;
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => void;
  isUpdating: boolean;
}

export const EnhancedAppointmentRow: React.FC<EnhancedAppointmentRowProps> = ({
  appointment,
  isSelected,
  onSelect,
  onStatusChange,
  onServiceUpdate,
  isUpdating
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  return (
    <TableRow 
      className={`hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => 
            onSelect(appointment.id, checked as boolean)
          }
          aria-label={`Selecionar agendamento de ${appointment.name}`}
          className="h-5 w-5"
        />
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{appointment.name}</p>
            {appointment.email && (
              <p className="text-xs text-gray-500">{appointment.email}</p>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3 text-gray-400" />
            <span>{appointment.phone}</span>
          </div>
          {appointment.email && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className="truncate max-w-32">{appointment.email}</span>
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {formatDate(appointment.date)}
            </p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formatTime(appointment.time)}
              </span>
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <AppointmentServiceInfo
          appointment={appointment}
          onServiceUpdate={onServiceUpdate}
          isUpdating={isUpdating}
        />
      </TableCell>
      
      <TableCell>
        <Badge variant="secondary" className="text-xs">
          {simplifyClinicName(appointment.clinic)}
        </Badge>
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
