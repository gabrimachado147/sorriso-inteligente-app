
import React, { Suspense } from 'react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  height = 'h-64'
}) => {
  const defaultFallback = (
    <div className={`w-full ${height} flex items-center justify-center`}>
      <EnhancedSkeleton variant="card" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};
