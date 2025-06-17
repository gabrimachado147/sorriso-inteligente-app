import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeadCaptureForm from '@/components/Institutional/LeadCaptureForm';
import { 
  MapPin, 
  Phone, 
  Star, 
  Users, 
  Award, 
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { animations } from '@/lib/animations';

const InstitutionalHome: React.FC = () => {
  const handleCTAClick = (action: string) => {
    // Analytics tracking
    console.log(`CTA clicked: ${action}`);
    
    if (action === 'agendar') {
      // Redirect to PWA app
      window.open('/schedule', '_blank');
    } else if (action === 'whatsapp') {
      window.open('https://wa.me/5535998695479', '_blank');
    }
  };

  return (
    <div className={`min-h-screen w-full bg-background mobile-scroll ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="mobile-container py-20">
          <div className="mobile-grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4 mobile-text-sm">
                ✨ Clínica Odontológica Premiada
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-6">
                Seu <span className="text-yellow-300">Sorriso Perfeito</span> 
                <br />Começa Aqui
              </h1>
              <p className="mobile-text-lg md:text-xl mb-8 text-blue-100">
                Transformamos sorrisos há mais de 10 anos. Avaliação gratuita, 
                tecnologia de ponta e o melhor atendimento em Minas Gerais e São Paulo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
                  onClick={() => handleCTAClick('agendar')}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Agendar Avaliação Gratuita
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-700 mobile-button-lg"
                  onClick={() => handleCTAClick('whatsapp')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp Agora
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <span className="mobile-text-sm">Avaliação 100% Gratuita</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <span className="mobile-text-sm">Sem Taxa de Adesão</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mobile-card-spacing">
                <h3 className="mobile-text-xl md:text-2xl font-bold mb-4">🎯 Oferta Especial</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                    <span className="mobile-text-base">Avaliação completa gratuita</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                    <span className="mobile-text-base">Plano de tratamento personalizado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                    <span className="mobile-text-base">Parcelamento em até 24x</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                    <span className="mobile-text-base">Primeira consulta hoje mesmo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mobile-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center mobile-card-spacing">
              <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">15K+</div>
              <div className="text-gray-600 mobile-text-sm">Sorrisos Transformados</div>
            </div>
            <div className="text-center mobile-card-spacing">
              <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600 mobile-text-sm">Unidades</div>
            </div>
            <div className="text-center mobile-card-spacing">
              <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">4.9</div>
              <div className="text-gray-600 flex items-center justify-center gap-1 mobile-text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                Avaliação Google
              </div>
            </div>
            <div className="text-center mobile-card-spacing">
              <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">10</div>
              <div className="text-gray-600 mobile-text-sm">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-12 md:py-20 bg-blue-50">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Agende Sua Avaliação Gratuita</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Preencha o formulário e receba seu plano de tratamento personalizado
            </p>
          </div>
          
          <div className="flex justify-center">
            <LeadCaptureForm 
              source="institutional_website"
              campaign="home_hero"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossos Tratamentos</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Tecnologia de ponta para cuidar do seu sorriso
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Implantodontia",
                description: "Implantes modernos com recuperação rápida",
                icon: "🦷",
                price: "A partir de R$ 89/mês"
              },
              {
                title: "Ortodontia",
                description: "Aparelhos tradicionais e alinhadores",
                icon: "😁",
                price: "A partir de R$ 99/mês"
              },
              {
                title: "Limpeza Dental",
                description: "Profilaxia completa e prevenção",
                icon: "✨",
                price: "A partir de R$ 45/mês"
              },
              {
                title: "Clareamento",
                description: "Sorriso mais branco e radiante",
                icon: "💫",
                price: "A partir de R$ 79/mês"
              },
              {
                title: "Prótese Dentária",
                description: "Reabilitação oral completa",
                icon: "🎯",
                price: "A partir de R$ 129/mês"
              },
              {
                title: "Endodontia",
                description: "Tratamento de canal sem dor",
                icon: "🏥",
                price: "A partir de R$ 99/mês"
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow mobile-card-spacing">
                <CardHeader>
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="mobile-text-lg md:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 mobile-text-base">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold mobile-text-sm">
                      {service.price}
                    </span>
                    <Button variant="outline" size="sm" className="mobile-button-sm">
                      Saiba Mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossas Unidades</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Encontre a clínica mais próxima de você
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                city: "Campo Belo - MG",
                address: "Av. Afonso Pena, 151, Centro",
                phone: "(35) 99891-3803",
                hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h"
              },
              {
                city: "Formiga - MG", 
                address: "R. Barão de Piumhy, 198, Centro",
                phone: "(37) 3443-0520",
                hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h"
              },
              {
                city: "Itararé - SP",
                address: "R. São Pedro, 1348, Centro", 
                phone: "(15) 99862-0028",
                hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h"
              },
              {
                city: "Capão Bonito - SP",
                address: "R. Floriano Peixoto, 732, Centro",
                phone: "(15) 2153-0549", 
                hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h"
              },
              {
                city: "Itapeva - SP",
                address: "R. Doutor Pinheiro, 558, Centro",
                phone: "(15) 2153-0549",
                hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h"
              }
            ].map((location, index) => (
              <Card key={index} className="mobile-card-spacing">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 mobile-text-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {location.city}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 mobile-text-sm">{location.address}</p>
                    <p className="flex items-center gap-2 mobile-text-sm">
                      <Phone className="h-4 w-4" />
                      {location.phone}
                    </p>
                    <p className="flex items-center gap-2 mobile-text-sm">
                      <Clock className="h-4 w-4" />
                      {location.hours}
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-4 mobile-button"
                    onClick={() => handleCTAClick('agendar')}
                  >
                    Agendar Nesta Unidade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="mobile-container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Pronto para Transformar seu Sorriso?
          </h2>
          <p className="mobile-text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Agende sua avaliação gratuita hoje mesmo e descubra como podemos 
            ajudar você a ter o sorriso dos seus sonhos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
              onClick={() => handleCTAClick('agendar')}
            >
              <Clock className="mr-2 h-5 w-5" />
              Agendar Avaliação Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-700 mobile-button-lg"
              onClick={() => handleCTAClick('whatsapp')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstitutionalHome;
