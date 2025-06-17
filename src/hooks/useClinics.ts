
import { useState, useEffect } from 'react';

export interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
}

export const useClinics = () => {
  const [clinics] = useState<Clinic[]>([
    { 
      id: 'campo-belo', 
      name: 'Senhor Sorriso Campo Belo', 
      city: 'Campo Belo', 
      state: 'MG' 
    },
    { 
      id: 'formiga', 
      name: 'Senhor Sorriso Formiga', 
      city: 'Formiga', 
      state: 'MG' 
    },
    { 
      id: 'itarare', 
      name: 'Senhor Sorriso Itararé', 
      city: 'Itararé', 
      state: 'SP' 
    },
    { 
      id: 'capao-bonito', 
      name: 'Senhor Sorriso Capão Bonito', 
      city: 'Capão Bonito', 
      state: 'SP' 
    },
    { 
      id: 'itapeva', 
      name: 'Senhor Sorriso Itapeva', 
      city: 'Itapeva', 
      state: 'SP' 
    }
  ]);

  const getClinicById = (id: string) => {
    return clinics.find(clinic => clinic.id === id);
  };

  const getClinicsByState = (state: string) => {
    return clinics.filter(clinic => clinic.state === state);
  };

  return {
    clinics,
    getClinicById,
    getClinicsByState
  };
};
