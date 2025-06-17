
import React from 'react';
import LocationsPage from '@/components/Locations/LocationsPage';
import { animations } from '@/lib/animations';

const ClinicsPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <LocationsPage />
    </div>
  );
};

export default ClinicsPage;
