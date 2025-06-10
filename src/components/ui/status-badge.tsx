
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 'confirmed' | 'pending' | 'cancelled' | 'urgent' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className 
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmado',
          icon: <Check className="h-3 w-3" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          label: 'Pendente',
          icon: <Clock className="h-3 w-3" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          icon: <X className="h-3 w-3" />,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'urgent':
        return {
          label: 'Urgente',
          icon: <AlertCircle className="h-3 w-3" />,
          className: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
        };
      case 'completed':
        return {
          label: 'Finalizado',
          icon: <Check className="h-3 w-3" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'Desconhecido',
          icon: <Clock className="h-3 w-3" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};
