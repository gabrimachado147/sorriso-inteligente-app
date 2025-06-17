
import React from 'react';
import { LazyLocationsPage } from '@/components/Locations/LazyLocationsPage';
import { animations } from '@/lib/animations';

const ClinicsPage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold">Nossas Clínicas</h1>
        <p className="text-muted-foreground mt-2">
          Encontre a unidade mais próxima de você
        </p>
      </div>
      <LazyLocationsPage />
    </div>
  );
};

export default ClinicsPage;
