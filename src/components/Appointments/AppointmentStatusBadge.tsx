
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentStatusBadgeProps {
  status: string;
  appointmentId: string;
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  isUpdating?: boolean;
}

export const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({
  status,
  appointmentId,
  onStatusChange,
  isUpdating = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      case 'no_show': return 'No Show';
      default: return 'Pendente';
    }
  };

  const handleStatusChange = (newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    onStatusChange(appointmentId, newStatus);
  };

  return (
    <Select 
      value={status} 
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-32 h-8 border-0 p-0">
        <Badge className={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pendente</SelectItem>
        <SelectItem value="confirmed">Confirmado</SelectItem>
        <SelectItem value="cancelled">Cancelado</SelectItem>
        <SelectItem value="completed">Concluído</SelectItem>
        <SelectItem value="no_show">No Show</SelectItem>
      </SelectContent>
    </Select>
  );
};
