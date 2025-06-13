
import React from 'react';
import { NearbyClinicas } from '@/components/Location/NearbyClinicas';

const ClinicsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clínicas Próximas</h1>
          <p className="text-gray-600">
            Encontre a clínica mais próxima de você
          </p>
        </div>
        
        <NearbyClinicas />
      </div>
    </div>
  );
};

export default ClinicsPage;
