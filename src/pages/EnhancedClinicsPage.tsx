
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { OptimizedMap, sampleClinics } from '@/components/ui/optimized-map';
import { animations } from '@/lib/animations';
import { MapPin, Star, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EnhancedClinicsPage = () => {
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Nossas Clínicas', href: '/clinics', icon: MapPin }
  ];

  return (
    <>
      <PageHead
        title="Localize Nossas Clínicas - Senhor Sorriso"
        description="Encontre a clínica Senhor Sorriso mais próxima de você. Unidades em Campo Belo-MG, Formiga-MG e Itararé-SP com atendimento de excelência."
        keywords="clínicas dentárias, localização, Campo Belo, Formiga, Itararé, endereços, telefones, horários, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/clinics"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-x-hidden">
        <MainLayout>
          <div className={`w-full overflow-x-hidden ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6 overflow-x-hidden">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <MapPin className="h-8 w-8 text-primary" />
                    Nossas Clínicas
                  </h1>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Encontre a unidade mais próxima de você. Oferecemos atendimento de qualidade 
                    com profissionais especializados em diversas localidades.
                  </p>
                </div>

                {/* Estatísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="text-sm text-muted-foreground">Unidades</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                        4.8 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="text-sm text-muted-foreground">Avaliação Média</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                        <Phone className="h-5 w-5" />
                        24h
                      </div>
                      <div className="text-sm text-muted-foreground">Atendimento</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mapa otimizado */}
                <OptimizedMap 
                  clinics={sampleClinics}
                  onClinicSelect={(clinic) => {
                    console.log('Clínica selecionada:', clinic);
                    // Aqui poderia integrar com analytics
                  }}
                />

                {/* Feedback */}
                <div className="max-w-md mx-auto">
                  <FeedbackSystem 
                    pageContext="Localização de Clínicas"
                    onSubmit={(feedback) => {
                      console.log('Feedback das Clínicas:', feedback);
                    }}
                  />
                </div>

                {/* Informações adicionais */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-medium text-green-900 mb-3">🌟 Por que escolher o Senhor Sorriso?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                    <div>
                      <h4 className="font-medium mb-2">✨ Tecnologia Avançada</h4>
                      <p>Equipamentos de última geração para diagnósticos precisos e tratamentos eficazes.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">👩‍⚕️ Equipe Especializada</h4>
                      <p>Profissionais qualificados e experientes em todas as especialidades odontológicas.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">🏥 Ambiente Acolhedor</h4>
                      <p>Clínicas modernas com ambiente confortável e acolhedor para toda a família.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">⏰ Horários Flexíveis</h4>
                      <p>Atendimento em horários convenientes, incluindo fins de semana em algumas unidades.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedClinicsPage;
