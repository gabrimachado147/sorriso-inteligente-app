
import React from 'react';
import { LazyLocationsPage } from '@/components/Locations/LazyLocationsPage';

const ClinicsPage = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full">
        <LazyLocationsPage />
      </div>
    </div>
  );
};

export default ClinicsPage;
