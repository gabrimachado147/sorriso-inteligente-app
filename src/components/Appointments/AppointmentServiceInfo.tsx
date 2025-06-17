
import React, { useState } from 'react';
import { DollarSign, Edit2, CreditCard, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { AdvancedServiceEditor } from './AdvancedServiceEditor';

interface AppointmentServiceInfoProps {
  appointment: AppointmentRecord;
  onServiceUpdate: (appointmentId: string, service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => void;
  isUpdating: boolean;
}

export const AppointmentServiceInfo: React.FC<AppointmentServiceInfoProps> = ({
  appointment,
  onServiceUpdate,
  isUpdating
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => {
    onServiceUpdate(appointment.id, service, price, originalPrice, discountPercent, paymentMethod);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return null;
    return `R$ ${price.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const hasDiscount = appointment.discount_percent && appointment.discount_percent > 0;
  const hasPaymentMethod = appointment.payment_method;

  if (isEditing) {
    return (
      <AdvancedServiceEditor
        service={appointment.service}
        price={appointment.price}
        originalPrice={appointment.original_price}
        discountPercent={appointment.discount_percent}
        paymentMethod={appointment.payment_method}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{appointment.service}</p>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {appointment.price && appointment.price > 0 && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium">
                {formatPrice(appointment.price)}
              </span>
            </div>
          )}
          
          {hasDiscount && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-1 rounded">
              <Percent className="h-3 w-3" />
              <span className="font-medium">
                {appointment.discount_percent}% OFF
              </span>
            </div>
          )}
          
          {appointment.original_price && hasDiscount && (
            <div className="text-xs text-gray-500 line-through">
              {formatPrice(appointment.original_price)}
            </div>
          )}
        </div>

        {hasPaymentMethod && (
          <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
            <CreditCard className="h-3 w-3" />
            <span className="truncate">{appointment.payment_method}</span>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        disabled={isUpdating}
        className="h-8 w-8 p-0 flex-shrink-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
