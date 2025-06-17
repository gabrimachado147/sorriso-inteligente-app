
import React from 'react';
import { LazyLocationsPage } from '@/components/Locations/LazyLocationsPage';
import { animations } from '@/lib/animations';

const ClinicsPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <LazyLocationsPage />
    </div>
  );
};

export default ClinicsPage;
