
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { LazyLocationsPage } from '@/components/Locations/LazyLocationsPage';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const ClinicsPage = () => {
  return (
    <>
      <PageHead
        title="Nossas Clínicas - Senhor Sorriso"
        description="Encontre a clínica Senhor Sorriso mais próxima de você. Localizações em Campo Belo-MG, Formiga-MG e Itararé-SP."
        keywords="clínicas dentárias, localização, Campo Belo, Formiga, Itararé, endereços, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/clinics"
      />
      <div className="w-full min-h-screen bg-background overflow-x-hidden">
        <MainLayout>
          <div className={`w-full overflow-x-hidden ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-6xl mx-auto">
              <div className="space-y-6 overflow-x-hidden">
                <LazyLocationsPage />
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default ClinicsPage;
