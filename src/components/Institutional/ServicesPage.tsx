
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { availableServices } from '@/components/Appointments/constants/services';
import { animations } from '@/lib/animations';
import { Calendar, CheckCircle, Clock, Heart } from 'lucide-react';

const ServicesPage = () => {
  const serviceCategories = {
    'Preventivo': ['avaliacao-gratuita', 'limpeza', 'fluoretacao'],
    'Estético': ['estetica-dental', 'clareamento', 'facetas'],
    'Ortodontia': ['ortodontia', 'invisalign'],
    'Cirúrgico': ['implantes', 'proteses', 'cirurgia-oral'],
    'Especializado': ['endodontia', 'periodontia', 'odontopediatria']
  };

  const benefits = [
    "Materiais de alta qualidade",
    "Tecnologia de ponta",
    "Profissionais especializados",
    "Ambiente acolhedor",
    "Protocolos de segurança",
    "Acompanhamento pós-tratamento"
  ];

  return (
    <div className="py-8 md:py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className={`space-y-4 ${animations.fadeInUp}`}>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Heart className="h-3 w-3 mr-1" />
            Nossos Serviços
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Tratamentos Completos para Toda a Família
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços odontológicos com tecnologia de ponta 
            e atendimento humanizado para cuidar do seu sorriso.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Por que escolher nossos serviços?
          </h2>
          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={benefit} className={`flex items-center gap-3 ${animations.fadeInUp}`}
                   style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-700 mobile-text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services by Category */}
      {Object.entries(serviceCategories).map(([category, serviceIds], categoryIndex) => {
        const categoryServices = availableServices.filter(service => 
          serviceIds.includes(service.id)
        );

        if (categoryServices.length === 0) return null;

        return (
          <section key={category} className={`space-y-8 ${animations.fadeInUp}`}
                   style={{ animationDelay: `${categoryIndex * 200}ms` }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {category}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3">
              {categoryServices.map((service, index) => (
                <Card key={service.id} className={`mobile-card-spacing h-full group hover:shadow-lg mobile-transition ${animations.scaleIn}`}
                      style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 mobile-transition">
                      {React.cloneElement(service.icon as React.ReactElement, { 
                        className: "h-8 w-8 text-primary" 
                      })}
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="mobile-text-lg group-hover:text-primary mobile-transition">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-primary mobile-text-base">
                        {service.price}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center mobile-text-sm leading-relaxed">
                      {service.description || `Tratamento profissional de ${service.name.toLowerCase()} com tecnologia avançada e cuidado personalizado.`}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration || '30-60min'}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mobile-touch-target group-hover:bg-primary group-hover:text-white mobile-transition" asChild>
                      <Link to="/">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              Pronto para cuidar do seu sorriso?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Agende sua consulta de avaliação gratuita e descubra qual o melhor tratamento para você.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="mobile-touch-target">
              <Link to="/">
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Avaliação Gratuita
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="mobile-touch-target bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link to="/institutional/contact">
                Entrar em Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
