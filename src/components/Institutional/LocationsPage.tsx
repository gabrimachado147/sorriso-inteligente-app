
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Clock,
  Car,
  Navigation,
  Star,
  Users,
  ArrowRight
} from 'lucide-react';
import { animations } from '@/lib/animations';

const LocationsPage: React.FC = () => {
  const handleCTAClick = (clinic: string) => {
    console.log(`Agendamento solicitado para: ${clinic}`);
    window.open('/schedule', '_blank');
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const locations = [
    {
      id: 1,
      city: "Campo Belo",
      state: "MG",
      address: "Av. Afonso Pena, 151, Centro",
      fullAddress: "Av. Afonso Pena, 151, Centro, Campo Belo - MG",
      phone: "(35) 99891-3803",
      hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h",
      established: "2014",
      patients: "3.500+",
      rating: 4.9,
      reviews: 280,
      services: [
        "Implantodontia",
        "Ortodontia", 
        "Limpeza Dental",
        "Clareamento",
        "Endodontia"
      ],
      image: "🏢",
      isMain: true
    },
    {
      id: 2,
      city: "Formiga",
      state: "MG", 
      address: "R. Barão de Piumhy, 198, Centro",
      fullAddress: "R. Barão de Piumhy, 198, Centro, Formiga - MG",
      phone: "(37) 3443-0520",
      hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h",
      established: "2018",
      patients: "2.800+",
      rating: 4.8,
      reviews: 195,
      services: [
        "Implantodontia",
        "Ortodontia",
        "Prótese Dentária",
        "Limpeza Dental"
      ],
      image: "🏬",
      isMain: false
    },
    {
      id: 3,
      city: "Itararé",
      state: "SP",
      address: "R. São Pedro, 1348, Centro",
      fullAddress: "R. São Pedro, 1348, Centro, Itararé - SP",
      phone: "(15) 99862-0028",
      hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h",
      established: "2022",
      patients: "1.900+",
      rating: 4.9,
      reviews: 145,
      services: [
        "Implantodontia",
        "Clareamento",
        "Limpeza Dental",
        "Cirurgia Oral"
      ],
      image: "🏪",
      isMain: false
    },
    {
      id: 4,
      city: "Capão Bonito",
      state: "SP",
      address: "R. Floriano Peixoto, 732, Centro",
      fullAddress: "R. Floriano Peixoto, 732, Centro, Capão Bonito - SP",
      phone: "(15) 2153-0549",
      hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h",
      established: "2022",
      patients: "1.200+",
      rating: 4.7,
      reviews: 98,
      services: [
        "Ortodontia",
        "Limpeza Dental",
        "Endodontia",
        "Periodontia"
      ],
      image: "🏬",
      isMain: false
    },
    {
      id: 5,
      city: "Itapeva",
      state: "SP",
      address: "R. Doutor Pinheiro, 558, Centro",
      fullAddress: "R. Doutor Pinheiro, 558, Centro, Itapeva - SP",
      phone: "(15) 2153-0549",
      hours: "Seg-Sex: 8h-19h | Sáb: 8h-13h",
      established: "2023",
      patients: "800+",
      rating: 4.8,
      reviews: 67,
      services: [
        "Implantodontia",
        "Ortodontia",
        "Clareamento",
        "Limpeza Dental"
      ],
      image: "🏢",
      isMain: false
    }
  ];

  const stats = [
    {
      number: "5",
      label: "Unidades",
      icon: "🏢"
    },
    {
      number: "15K+",
      label: "Pacientes Atendidos",
      icon: "👥"
    },
    {
      number: "4.8",
      label: "Avaliação Média",
      icon: "⭐"
    },
    {
      number: "10+",
      label: "Anos de Experiência",
      icon: "🎯"
    }
  ];

  return (
    <div className={`min-h-screen w-full bg-background mobile-scroll ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 mobile-text-sm">
              📍 Nossas Unidades
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
              Encontre a <span className="text-yellow-300">Clínica</span>
              <br />Mais Próxima de Você
            </h1>
            <p className="mobile-text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              5 unidades estrategicamente localizadas em Minas Gerais e São Paulo 
              para atender você com excelência e comodidade.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mobile-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center mobile-card-spacing">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 mobile-text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossas Unidades</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Escolha a unidade mais conveniente e agende sua consulta
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {locations.map((location) => (
              <Card key={location.id} className={`mobile-card-spacing hover:shadow-xl transition-all duration-300 ${location.isMain ? 'border-blue-500 shadow-lg' : ''}`}>
                {location.isMain && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600 text-white mobile-text-xs">
                    Unidade Principal
                  </Badge>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{location.image}</div>
                    <div>
                      <CardTitle className="mobile-text-lg md:text-xl">
                        {location.city} - {location.state}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="mobile-text-sm font-medium">{location.rating}</span>
                        <span className="mobile-text-sm text-gray-500">({location.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="mobile-text-sm text-gray-600">{location.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="mobile-text-sm">{location.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="mobile-text-sm text-gray-600">{location.hours}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="mobile-text-sm font-medium text-green-600">
                        {location.patients} pacientes atendidos
                      </span>
                    </div>
                    <p className="mobile-text-xs text-gray-500">
                      Desde {location.established}
                    </p>
                  </div>

                  <div>
                    <p className="mobile-text-sm font-medium mb-2">Tratamentos Disponíveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="mobile-text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mobile-button"
                      onClick={() => handleCTAClick(`${location.city} - ${location.state}`)}
                    >
                      Agendar Nesta Unidade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 mobile-button-sm"
                        onClick={() => handleDirections(location.fullAddress)}
                      >
                        <Navigation className="mr-1 h-3 w-3" />
                        Rotas
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 mobile-button-sm"
                        onClick={() => handleWhatsApp(location.phone)}
                      >
                        <Phone className="mr-1 h-3 w-3" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="mobile-container text-center">
          <MapPin className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Qual Unidade Fica Mais Perto de Você?
          </h2>
          <p className="mobile-text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Escolha a unidade mais conveniente e agende sua avaliação gratuita. 
            Estamos esperando para cuidar do seu sorriso!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
              onClick={() => handleCTAClick('Qualquer unidade')}
            >
              <Clock className="mr-2 h-5 w-5" />
              Agendar Avaliação Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-700 mobile-button-lg"
              onClick={() => handleWhatsApp('(35) 99891-3803')}
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

export default LocationsPage;
