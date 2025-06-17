
import React, { Suspense } from 'react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';

const HomePage = React.lazy(() => import('./HomePage'));

const HomePageSkeleton = () => (
  <div className="p-4 space-y-6">
    {/* Hero section skeleton */}
    <div className="space-y-4 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
      <EnhancedSkeleton className="h-8 w-64" />
      <EnhancedSkeleton className="h-4 w-48" />
      <EnhancedSkeleton className="h-10 w-32" />
    </div>

    {/* Quick actions skeleton */}
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <EnhancedSkeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>

    {/* Sections skeleton */}
    {Array.from({ length: 3 }).map((_, i) => (
      <EnhancedSkeleton key={i} variant="card" />
    ))}
  </div>
);

export const LazyHomePage: React.FC = () => {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePage />
    </Suspense>
  );
};

export default LazyHomePage;
