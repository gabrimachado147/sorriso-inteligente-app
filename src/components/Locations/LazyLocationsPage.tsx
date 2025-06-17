
import React, { Suspense } from 'react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';

const LocationsPage = React.lazy(() => import('./LocationsPage'));

const LocationsPageSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <EnhancedSkeleton className="h-8 w-64" />
      <EnhancedSkeleton className="h-4 w-48" />
    </div>
    <EnhancedSkeleton variant="clinic-card" count={3} />
  </div>
);

export const LazyLocationsPage: React.FC = () => {
  return (
    <Suspense fallback={<LocationsPageSkeleton />}>
      <LocationsPage />
    </Suspense>
  );
};

export default LazyLocationsPage;
