
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar,
  Users,
  Award,
  Shield,
  Sparkles
} from 'lucide-react';
import { LeadCaptureForm } from '@/components/Institutional/LeadCaptureForm';
import { animations } from '@/lib/animations';

const InstitutionalHome = () => {
  const features = [
    {
      icon: Heart,
      title: "Atendimento Humanizado",
      description: "Cuidamos de você com carinho e atenção em cada consulta"
    },
    {
      icon: Star,
      title: "Excelência em Qualidade",
      description: "Mais de 5 anos cuidando do sorriso da nossa comunidade"
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Agendamento fácil e horários que se adaptam à sua rotina"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Protocolos rigorosos de segurança e higienização"
    }
  ];

  const services = [
    { name: "Avaliação Gratuita", price: "Grátis", popular: true },
    { name: "Limpeza", price: "A partir de R$ 80", popular: true },
    { name: "Ortodontia", price: "A partir de R$ 150", popular: true },
    { name: "Estética Dental", price: "A partir de R$ 200", popular: false },
    { name: "Implantes", price: "Consulte valores", popular: false },
    { name: "Próteses", price: "Consulte valores", popular: false }
  ];

  const stats = [
    { icon: Users, number: "5000+", label: "Pacientes Atendidos" },
    { icon: Award, number: "5", label: "Anos de Experiência" },
    { icon: MapPin, number: "3", label: "Unidades" },
    { icon: Star, number: "4.9", label: "Avaliação Média" }
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-blue-50 to-white py-16 md:py-24 overflow-hidden">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${animations.fadeInUp}`}>
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Clínica Odontológica
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Seu sorriso é nossa <span className="text-primary">paixão</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Cuidamos da sua saúde bucal com carinho, tecnologia e profissionalismo. 
                  Agende sua consulta e descubra como é ter um sorriso saudável e bonito.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="mobile-touch-target text-base">
                  <Link to="/">Agendar Consulta</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="mobile-touch-target text-base">
                  <Link to="/institutional/services">Ver Serviços</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Agendamento rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Avaliação 4.9/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>100% seguro</span>
                </div>
              </div>
            </div>

            <div className={`${animations.fadeInUp} ${animations.slideInRight}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <img 
                  src="/lovable-uploads/239d166e-ad2a-4b8e-9fef-073da7ed8b39.png"
                  alt="Senhor Sorriso - Clínica Odontológica"
                  className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="mobile-container">
          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={`text-center mobile-card-spacing ${animations.scaleIn}`}
                      style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-4">
                    <Icon className="h-8 w-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                      {stat.number}
                    </CardTitle>
                    <CardDescription className="mobile-text-base font-medium">
                      {stat.label}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Senhor Sorriso?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos tradição, inovação e carinho para oferecer o melhor atendimento odontológico
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className={`mobile-card-spacing h-full ${animations.fadeInUp}`}
                      style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mobile-text-lg">{feature.title}</CardTitle>
                    <CardDescription className="mobile-text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12 md:py-16">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Tratamentos completos para toda a família com tecnologia de ponta
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={service.name} className={`mobile-card-spacing h-full relative ${animations.scaleIn}`}
                    style={{ animationDelay: `${index * 100}ms` }}>
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                    Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="mobile-text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary mobile-text-base">
                    {service.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full mobile-touch-target" asChild>
                    <Link to="/">Agendar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="mobile-touch-target">
              <Link to="/institutional/services">Ver Todos os Serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${animations.fadeInUp}`}>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Agende sua consulta gratuita
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Faça uma avaliação completa sem compromisso. Nossa equipe está pronta para cuidar do seu sorriso.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Atendimento personalizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Avaliação completa gratuita</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Sem compromisso</span>
                </div>
              </div>
            </div>

            <div className={`${animations.fadeInUp} ${animations.slideInRight}`}>
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="mobile-container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold">
              Pronto para transformar seu sorriso?
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              Entre em contato conosco e descubra como podemos ajudar você a ter o sorriso dos seus sonhos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="mobile-touch-target">
                <Link to="/">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Consulta
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="mobile-touch-target bg-transparent border-white text-white hover:bg-white hover:text-primary">
                <Link to="/institutional/contact">
                  <Phone className="h-5 w-5 mr-2" />
                  Entrar em Contato
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstitutionalHome;
