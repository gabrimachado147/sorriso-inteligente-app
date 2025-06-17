
import React from 'react';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

// Skeleton específico para cards de estatísticas do dashboard
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className={`p-4 border rounded-lg ${animations.fadeIn}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
          <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
        </div>
        <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
      </div>
    </div>
  );
};

// Skeleton para gráficos
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <div className={`border rounded-lg p-6 ${animations.fadeIn}`}>
      <div className="space-y-4">
        <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
        <div 
          className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded"
          style={{ height: `${height}px` }}
        />
      </div>
    </div>
  );
};

// Skeleton para tabela de agendamentos
export const AppointmentsTableSkeleton: React.FC = () => {
  return (
    <div className={`border rounded-lg ${animations.fadeIn}`}>
      <div className="p-4 border-b">
        <div className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 border rounded">
            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
            <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
            <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton para dashboard completo
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
        <div className="h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
};
