
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { 
  Heart, 
  Award, 
  Users, 
  Clock,
  MapPin,
  Shield,
  Sparkles,
  Calendar,
  Star
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Cuidado Humanizado",
      description: "Tratamos cada paciente com carinho e dedicação, priorizando o bem-estar e conforto em todos os momentos."
    },
    {
      icon: Award,
      title: "Excelência Técnica",
      description: "Profissionais qualificados e em constante atualização, utilizando as melhores práticas da odontologia moderna."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Protocolos rigorosos de biossegurança e higienização para garantir a proteção de todos os nossos pacientes."
    },
    {
      icon: Users,
      title: "Atendimento Familiar",
      description: "Cuidamos de toda a família, desde crianças até idosos, com especialistas para cada faixa etária."
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Fundação",
      description: "Início das atividades com o sonho de democratizar o acesso à saúde bucal de qualidade."
    },
    {
      year: "2020",
      title: "Primeira Expansão",
      description: "Abertura da segunda unidade e implementação de novos tratamentos especializados."
    },
    {
      year: "2022",
      title: "Tecnologia Avançada",
      description: "Investimento em equipamentos de última geração e digitalização completa dos processos."
    },
    {
      year: "2024",
      title: "Rede Consolidada",
      description: "Mais de 5.000 pacientes atendidos e presença em múltiplas cidades da região."
    }
  ];

  const team = [
    {
      name: "Dr. João Silva",
      specialty: "Ortodontista",
      experience: "15 anos de experiência",
      description: "Especialista em ortodontia e harmonização facial"
    },
    {
      name: "Dra. Maria Santos",
      specialty: "Implantodontista",
      experience: "12 anos de experiência",
      description: "Referência em implantes e reabilitação oral"
    },
    {
      name: "Dr. Pedro Costa",
      specialty: "Odontopediatra",
      experience: "10 anos de experiência",
      description: "Especialista no atendimento infantil e adolescente"
    }
  ];

  return (
    <div className="py-8 md:py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className={`space-y-4 ${animations.fadeInUp}`}>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            Nossa História
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Mais de 5 anos cuidando do seu sorriso
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Somos uma rede de clínicas odontológicas comprometida em oferecer tratamentos 
            de qualidade com tecnologia avançada e atendimento humanizado.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${animations.fadeInUp}`}>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Democratizar o acesso à saúde bucal de qualidade, proporcionando 
                tratamentos eficazes em um ambiente acolhedor e seguro. Acreditamos 
                que todos merecem ter um sorriso saudável e bonito.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Tratamentos acessíveis e de qualidade</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Tecnologia de ponta em todos os procedimentos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Atendimento humanizado e personalizado</span>
                </div>
              </div>
            </div>
            
            <div className={`${animations.fadeInUp} ${animations.slideInRight}`}>
              <img 
                src="/lovable-uploads/ca774d8a-1da5-4d35-a302-f23676e88e03.png"
                alt="Missão Senhor Sorriso"
                className="w-full max-w-md mx-auto rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que norteiam nossa atuação e nos tornam referência em cuidados odontológicos
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className={`mobile-card-spacing h-full text-center ${animations.scaleIn}`}
                      style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mobile-text-lg">{value.title}</CardTitle>
                    <CardDescription className="mobile-text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gray-50 py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Uma jornada de crescimento e conquistas
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className={`flex gap-6 ${animations.fadeInUp}`}
                   style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais especializados e comprometidos com a sua saúde bucal
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Card key={member.name} className={`mobile-card-spacing h-full text-center ${animations.scaleIn}`}
                    style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="mobile-text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold mobile-text-base">
                    {member.specialty}
                  </CardDescription>
                  <p className="text-sm text-gray-500">{member.experience}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mobile-text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              Venha conhecer nossa clínica
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Agende uma visita e conheça nossa estrutura, equipe e tecnologias de perto.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="mobile-touch-target">
              <Link to="/app">
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Consulta
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="mobile-touch-target bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link to="/institutional/locations">
                <MapPin className="h-5 w-5 mr-2" />
                Ver Unidades
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
