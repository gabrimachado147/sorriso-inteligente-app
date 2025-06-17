
import React from 'react';
import { DollarSign } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { ServiceEditor } from './ServiceEditor';

interface AppointmentServiceInfoProps {
  appointment: AppointmentRecord;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  isUpdating: boolean;
}

export const AppointmentServiceInfo: React.FC<AppointmentServiceInfoProps> = ({
  appointment,
  onServiceUpdate,
  isUpdating
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <p className="text-sm font-medium truncate">{appointment.service}</p>
        {(appointment as any).price && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <DollarSign className="h-3 w-3" />
            <span className="truncate">
              R$ {(appointment as any).price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
      <ServiceEditor
        appointment={appointment}
        onUpdate={onServiceUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};
