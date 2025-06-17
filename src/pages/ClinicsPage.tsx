
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { LocationsPage } from '@/components/Locations/LocationsPage';
import { PageHead } from '@/components/SEO/PageHead';

const ClinicsPage = () => {
  return (
    <>
      <PageHead
        title="Nossas Clínicas - Localização e Contato"
        description="Encontre a clínica Senhor Sorriso mais próxima de você. Endereços, telefones e horários de funcionamento de todas as unidades."
        keywords="clínicas Senhor Sorriso, localização, endereço, telefone, horário funcionamento, unidades"
        url="https://senhorsorrisso.com.br/clinics"
      />
      <MainLayout>
        <LocationsPage />
      </MainLayout>
    </>
  );
};

export default ClinicsPage;
