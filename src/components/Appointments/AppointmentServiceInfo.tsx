
import React, { useState } from 'react';
import { DollarSign, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (service: string, price?: number) => {
    onServiceUpdate(appointment.id, service, price);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ServiceEditor
        service={appointment.service}
        price={(appointment as any).price}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        disabled={isUpdating}
        className="h-8 w-8 p-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
