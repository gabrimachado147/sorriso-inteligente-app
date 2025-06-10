
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface EnhancedSkeletonProps {
  variant: 'clinic-card' | 'appointment-card' | 'service-card' | 'chat-message' | 'list-item';
  count?: number;
  className?: string;
}

export const EnhancedSkeleton: React.FC<EnhancedSkeletonProps> = ({ 
  variant, 
  count = 1, 
  className 
}) => {
  const renderSkeletonByVariant = () => {
    switch (variant) {
      case 'clinic-card':
        return (
          <div className={cn("border rounded-lg p-4 space-y-3", className)}>
            <Skeleton className="h-8 w-3/4" /> {/* Nome da clínica */}
            <Skeleton className="h-4 w-full" /> {/* Endereço linha 1 */}
            <Skeleton className="h-4 w-2/3" /> {/* Endereço linha 2 */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" /> {/* Botão ligar */}
              <Skeleton className="h-9 w-24" /> {/* Botão whatsapp */}
              <Skeleton className="h-9 w-20" /> {/* Botão rota */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Botão agendar */}
          </div>
        );

      case 'appointment-card':
        return (
          <div className={cn("border rounded-lg p-4 space-y-3", className)}>
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" /> {/* Serviço */}
                <Skeleton className="h-4 w-1/2" /> {/* Data */}
                <Skeleton className="h-4 w-2/3" /> {/* Clínica */}
              </div>
              <Skeleton className="h-6 w-20" /> {/* Status badge */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" /> {/* Botão 1 */}
              <Skeleton className="h-8 w-24" /> {/* Botão 2 */}
            </div>
          </div>
        );

      case 'service-card':
        return (
          <div className={cn("border rounded-lg p-4 space-y-3", className)}>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" /> {/* Ícone */}
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" /> {/* Nome do serviço */}
                <Skeleton className="h-4 w-full" /> {/* Descrição */}
              </div>
            </div>
            <Skeleton className="h-4 w-1/2" /> {/* Preço */}
          </div>
        );

      case 'chat-message':
        return (
          <div className={cn("flex items-start space-x-2 mb-4", className)}>
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" /> {/* Mensagem linha 1 */}
              <Skeleton className="h-4 w-1/2" /> {/* Mensagem linha 2 */}
            </div>
          </div>
        );

      case 'list-item':
        return (
          <div className={cn("flex items-center space-x-3 py-3", className)}>
            <Skeleton className="h-6 w-6 rounded" /> {/* Ícone */}
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-3/4" /> {/* Título */}
              <Skeleton className="h-3 w-1/2" /> {/* Subtítulo */}
            </div>
            <Skeleton className="h-4 w-16" /> {/* Valor/Data */}
          </div>
        );

      default:
        return <Skeleton className={cn("h-4 w-full", className)} />;
    }
  };

  return (
    <div className={animations.pulse}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mb-4 last:mb-0">
          {renderSkeletonByVariant()}
        </div>
      ))}
    </div>
  );
};
