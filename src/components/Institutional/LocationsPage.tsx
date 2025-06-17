
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  Bus, 
  Navigation,
  Star,
  CheckCircle
} from 'lucide-react';
import { animations } from '@/lib/animations';

const LocationsPage = () => {
  const clinics = [
    {
      id: 1,
      name: "Senhor Sorriso Centro",
      address: "Rua das Flores, 123 - Centro",
      city: "São Paulo, SP",
      phone: "(11) 3333-3333",
      whatsapp: "(11) 99999-1111",
      hours: {
        weekdays: "8h às 18h",
        saturday: "8h às 14h",
        sunday: "Fechado"
      },
      services: ["Clínica Geral", "Ortodontia", "Implantes", "Estética"],
      features: ["Estacionamento", "Acessibilidade", "Wi-Fi", "Ar Condicionado"],
      rating: 4.9,
      reviews: 156,
      transport: {
        metro: "Estação Sé (Linha Azul) - 5min caminhando",
        bus: "Várias linhas param próximo"
      }
    },
    {
      id: 2,
      name: "Senhor Sorriso Vila Mariana",
      address: "Avenida Paulista, 456 - Vila Mariana",
      city: "São Paulo, SP",
      phone: "(11) 3333-4444",
      whatsapp: "(11) 99999-2222",
      hours: {
        weekdays: "7h às 19h",
        saturday: "8h às 16h",
        sunday: "Emergências"
      },
      services: ["Clínica Geral", "Periodontia", "Endodontia", "Cirurgia"],
      features: ["Estacionamento Grátis", "Acessibilidade Total", "Wi-Fi", "Café"],
      rating: 4.8,
      reviews: 203,
      transport: {
        metro: "Estação Vila Mariana (Linha Azul) - 3min caminhando",
        bus: "Corredor de ônibus na Av. Paulista"
      }
    },
    {
      id: 3,
      name: "Senhor Sorriso Mooca",
      address: "Rua da Mooca, 789 - Mooca",
      city: "São Paulo, SP",
      phone: "(11) 3333-5555",
      whatsapp: "(11) 99999-3333",
      hours: {
        weekdays: "8h às 18h",
        saturday: "8h às 12h",
        sunday: "Fechado"
      },
      services: ["Clínica Geral", "Odontopediatria", "Ortodontia", "Próteses"],
      features: ["Estacionamento", "Área Kids", "Wi-Fi", "Rampa de Acesso"],
      rating: 4.7,
      reviews: 98,
      transport: {
        metro: "Estação Mooca (Linha Coral) - 8min caminhando",
        bus: "Terminal Mooca próximo"
      }
    }
  ];

  const allServices = [
    "Avaliação Gratuita", "Limpeza", "Clareamento", "Ortodontia", 
    "Implantes", "Próteses", "Endodontia", "Periodontia", 
    "Cirurgia Oral", "Estética Dental", "Odontopediatria"
  ];

  return (
    <div className="py-8 md:py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className={`space-y-4 ${animations.fadeInUp}`}>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <MapPin className="h-3 w-3 mr-1" />
            Nossas Unidades
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Encontre a Unidade Mais Próxima
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Temos unidades estrategicamente localizadas para facilitar seu acesso. 
            Todas com a mesma qualidade e excelência no atendimento.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-gray-50 py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Serviços Disponíveis em Todas as Unidades
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {allServices.map((service, index) => (
              <Badge key={service} variant="secondary" className={`text-sm mobile-text-xs ${animations.scaleIn}`}
                     style={{ animationDelay: `${index * 50}ms` }}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Clinics List */}
      <section className="space-y-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Escolha Sua Unidade Preferida
        </h2>

        <div className="space-y-8">
          {clinics.map((clinic, index) => (
            <Card key={clinic.id} className={`mobile-card-spacing overflow-hidden ${animations.fadeInUp}`}
                  style={{ animationDelay: `${index * 200}ms` }}>
              <div className="mobile-grid lg:grid-cols-3 gap-6">
                {/* Clinic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl md:text-2xl mobile-text-lg">
                          {clinic.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mobile-text-base">
                          <MapPin className="h-4 w-4" />
                          {clinic.address}, {clinic.city}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{clinic.rating}</span>
                        <span className="text-gray-500">({clinic.reviews} avaliações)</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Contact & Hours */}
                    <div className="mobile-grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Contato</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{clinic.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span>WhatsApp: {clinic.whatsapp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Horários</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Seg - Sex:</span>
                            <span className="font-medium">{clinic.hours.weekdays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sábado:</span>
                            <span className="font-medium">{clinic.hours.saturday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Domingo:</span>
                            <span className="font-medium">{clinic.hours.sunday}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Especialidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {clinic.services.map(service => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Comodidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {clinic.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Transport */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Como Chegar</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Bus className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{clinic.transport.metro}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Car className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{clinic.transport.bus}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <Button className="w-full mobile-touch-target" asChild>
                    <a href="/">Agendar Consulta</a>
                  </Button>
                  <Button variant="outline" className="w-full mobile-touch-target" asChild>
                    <a href={`https://wa.me/55${clinic.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full mobile-touch-target" asChild>
                    <a href={`https://maps.google.com?q=${encodeURIComponent(clinic.address + ', ' + clinic.city)}`} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full mobile-touch-target" asChild>
                    <a href={`tel:${clinic.phone.replace(/\D/g, '')}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar Agora
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              Não sabe qual unidade escolher?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Nossa equipe pode ajudar você a encontrar a unidade mais conveniente 
              e agendar sua consulta.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="mobile-touch-target">
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="mobile-touch-target bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <a href="/">
                Agendar Online
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
