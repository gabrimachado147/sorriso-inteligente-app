
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart,
  Shield,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Smile,
  Sparkles
} from 'lucide-react';
import { animations } from '@/lib/animations';

const ServicesPage: React.FC = () => {
  const handleCTAClick = () => {
    window.open('/schedule', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5535998695479', '_blank');
  };

  const services = [
    {
      title: "Implantodontia",
      description: "Recupere seus dentes com implantes de última geração",
      icon: "🦷",
      price: "A partir de R$ 89/mês",
      features: [
        "Implantes nacionais e importados",
        "Cirurgia guiada por computador",
        "Pós-operatório acompanhado",
        "Garantia de 5 anos"
      ],
      popular: true
    },
    {
      title: "Ortodontia",
      description: "Alinhe seu sorriso com aparelhos modernos",
      icon: "😁",
      price: "A partir de R$ 99/mês",
      features: [
        "Aparelho fixo metálico ou estético",
        "Alinhadores invisíveis",
        "Consultas mensais incluídas",
        "Plano de tratamento personalizado"
      ],
      popular: true
    },
    {
      title: "Limpeza Dental",
      description: "Mantenha sua saúde bucal em dia",
      icon: "✨",
      price: "A partir de R$ 45/mês",
      features: [
        "Profilaxia completa",
        "Remoção de tártaro",
        "Aplicação de flúor",
        "Orientação de higiene"
      ],
      popular: false
    },
    {
      title: "Clareamento Dental",
      description: "Tenha um sorriso mais branco e radiante",
      icon: "💫",
      price: "A partir de R$ 79/mês",
      features: [
        "Clareamento a laser",
        "Moldeiras personalizadas",
        "Gel clareador profissional",
        "Resultados em até 3 sessões"
      ],
      popular: false
    },
    {
      title: "Prótese Dentária",
      description: "Reabilitação oral completa e funcional",
      icon: "🎯",
      price: "A partir de R$ 129/mês",
      features: [
        "Próteses fixas e removíveis",
        "Materiais de alta qualidade",
        "Ajustes e manutenção incluídos",
        "Estética natural"
      ],
      popular: false
    },
    {
      title: "Endodontia",
      description: "Tratamento de canal sem dor",
      icon: "🏥",
      price: "A partir de R$ 99/mês",
      features: [
        "Técnicas modernas e indolores",
        "Microscopia operatória",
        "Medicação pós-operatória",
        "Acompanhamento completo"
      ],
      popular: false
    },
    {
      title: "Periodontia",
      description: "Tratamento de gengivas e ossos de suporte",
      icon: "🌸",
      price: "A partir de R$ 85/mês",
      features: [
        "Raspagem e alisamento radicular",
        "Cirurgias periodontais",
        "Enxertos gengivais",
        "Manutenção periodontal"
      ],
      popular: false
    },
    {
      title: "Cirurgia Oral",
      description: "Extrações e cirurgias especializadas",
      icon: "⚕️",
      price: "A partir de R$ 95/mês",
      features: [
        "Extrações simples e complexas",
        "Remoção de sisos",
        "Cirurgias pré-protéticas",
        "Sedação consciente disponível"
      ],
      popular: false
    },
    {
      title: "Odontopediatria",
      description: "Cuidado especializado para crianças",
      icon: "👶",
      price: "A partir de R$ 65/mês",
      features: [
        "Ambiente lúdico e acolhedor",
        "Técnicas específicas para crianças",
        "Orientação aos pais",
        "Prevenção e tratamento"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Tecnologia de Ponta",
      description: "Equipamentos modernos e técnicas avançadas para os melhores resultados"
    },
    {
      icon: Heart,
      title: "Atendimento Humanizado",
      description: "Equipe especializada e cuidado personalizado para cada paciente"
    },
    {
      icon: Star,
      title: "Qualidade Comprovada",
      description: "Mais de 15.000 sorrisos transformados com excelência"
    },
    {
      icon: Clock,
      title: "Rapidez no Atendimento",
      description: "Agendamento fácil e horários flexíveis para sua comodidade"
    }
  ];

  return (
    <div className={`min-h-screen w-full bg-background mobile-scroll ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 mobile-text-sm">
              ✨ Tratamentos Odontológicos
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
              Transforme seu <span className="text-yellow-300">Sorriso</span>
              <br />com Nossos Tratamentos
            </h1>
            <p className="mobile-text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Oferecemos uma gama completa de tratamentos odontológicos com 
              tecnologia de ponta e profissionais especializados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
                onClick={handleCTAClick}
              >
                <Clock className="mr-2 h-5 w-5" />
                Agendar Avaliação Gratuita
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-700 mobile-button-lg"
                onClick={handleWhatsAppClick}
              >
                <Heart className="mr-2 h-5 w-5" />
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Por que Escolher a Senhor Sorriso?
            </h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Compromisso com a excelência em cada tratamento
            </p>
          </div>

          <div className="mobile-grid lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center mobile-card-spacing hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="mobile-text-lg md:text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mobile-text-base">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossos Tratamentos</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Soluções completas para todas as suas necessidades odontológicas
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative mobile-card-spacing hover:shadow-xl transition-all duration-300 ${service.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                {service.popular && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600 text-white mobile-text-xs">
                    Mais Procurado
                  </Badge>
                )}
                
                <CardHeader>
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="mobile-text-lg md:text-xl">{service.title}</CardTitle>
                  <p className="text-gray-600 mobile-text-base">{service.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <span className="text-blue-600 font-bold mobile-text-lg md:text-xl">
                      {service.price}
                    </span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="mobile-text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mobile-button"
                      onClick={handleCTAClick}
                    >
                      Agendar Consulta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full mobile-button-sm"
                      onClick={handleWhatsAppClick}
                    >
                      Tirar Dúvidas no WhatsApp
                    </Button>
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
          <Sparkles className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Pronto para Transformar seu Sorriso?
          </h2>
          <p className="mobile-text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Agende sua avaliação gratuita e descubra qual tratamento é ideal para você. 
            Nossa equipe está pronta para cuidar do seu sorriso!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
              onClick={handleCTAClick}
            >
              <Smile className="mr-2 h-5 w-5" />
              Começar Minha Transformação
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-700 mobile-button-lg"
              onClick={handleWhatsAppClick}
            >
              <Heart className="mr-2 h-5 w-5" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
