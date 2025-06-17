import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Target,
  Star,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { animations } from '@/lib/animations';

const AboutPage: React.FC = () => {
  return (
    <div className={`min-h-screen w-full bg-background mobile-scroll ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 mobile-text-sm">
              Sobre a Senhor Sorriso
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
              Transformando Sorrisos há mais de 
              <span className="text-yellow-300"> 10 Anos</span>
            </h1>
            <p className="mobile-text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Somos uma rede de clínicas odontológicas comprometida em oferecer 
              tratamentos de excelência, com tecnologia de ponta e atendimento humanizado.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-3 gap-8 md:gap-12">
            <Card className="text-center mobile-card-spacing">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mobile-text-xl md:text-2xl">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mobile-text-base">
                  Proporcionar saúde bucal de qualidade, transformando sorrisos e 
                  melhorando a autoestima dos nossos pacientes através de tratamentos 
                  personalizados e tecnologia avançada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center mobile-card-spacing">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="mobile-text-xl md:text-2xl">Nossos Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mobile-text-base">
                  Ética, transparência, excelência técnica e atendimento humanizado. 
                  Acreditamos que cada paciente merece cuidado individual e tratamento 
                  de qualidade acessível.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center mobile-card-spacing">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="mobile-text-xl md:text-2xl">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mobile-text-base">
                  Ser reconhecida como a melhor rede de clínicas odontológicas do 
                  interior, expandindo nossa presença e levando sorrisos saudáveis 
                  para toda família brasileira.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossa História</h2>
              <p className="mobile-text-lg md:text-xl text-gray-600">
                Uma jornada de dedicação e crescimento
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              {/* Timeline items - keeping structure but making mobile-first */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <div className="bg-blue-600 text-white p-4 md:p-6 rounded-lg text-center mobile-card-spacing">
                    <Calendar className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-4" />
                    <h3 className="mobile-text-xl md:text-2xl font-bold">2014</h3>
                    <p className="mobile-text-base">Início da Jornada</p>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="mobile-text-xl md:text-2xl font-bold mb-4">Fundação em Campo Belo</h3>
                  <p className="text-gray-600 mobile-text-base">
                    Iniciamos nossa trajetória em Campo Belo - MG, com o sonho de 
                    democratizar o acesso à odontologia de qualidade. Nossa primeira 
                    clínica nasceu com o compromisso de oferecer tratamentos de 
                    excelência a preços justos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full md:w-1/3 md:order-2">
                  <div className="bg-green-600 text-white p-4 md:p-6 rounded-lg text-center mobile-card-spacing">
                    <Users className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-4" />
                    <h3 className="mobile-text-xl md:text-2xl font-bold">2018</h3>
                    <p className="mobile-text-base">Expansão Regional</p>
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:order-1">
                  <h3 className="mobile-text-xl md:text-2xl font-bold mb-4">Crescimento e Expansão</h3>
                  <p className="text-gray-600 mobile-text-base">
                    Expandimos para Formiga - MG e região, levando nossos serviços 
                    para mais famílias. Investimos em tecnologia de ponta e 
                    capacitação contínua da nossa equipe.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <div className="bg-purple-600 text-white p-4 md:p-6 rounded-lg text-center mobile-card-spacing">
                    <Award className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-4" />
                    <h3 className="mobile-text-xl md:text-2xl font-bold">2022</h3>
                    <p className="mobile-text-base">Reconhecimento</p>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="mobile-text-xl md:text-2xl font-bold mb-4">Expansão para São Paulo</h3>
                  <p className="text-gray-600 mobile-text-base">
                    Chegamos ao estado de São Paulo com unidades em Itararé, 
                    Capão Bonito e Itapeva. Alcançamos a marca de 10.000 
                    pacientes atendidos com excelência.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full md:w-1/3 md:order-2">
                  <div className="bg-yellow-600 text-white p-4 md:p-6 rounded-lg text-center mobile-card-spacing">
                    <Shield className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-4" />
                    <h3 className="mobile-text-xl md:text-2xl font-bold">2024</h3>
                    <p className="mobile-text-base">Inovação Digital</p>
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:order-1">
                  <h3 className="mobile-text-xl md:text-2xl font-bold mb-4">Transformação Digital</h3>
                  <p className="text-gray-600 mobile-text-base">
                    Lançamos nossa plataforma digital com agendamento online, 
                    chat inteligente e atendimento 24/7. Continuamos inovando 
                    para oferecer a melhor experiência aos nossos pacientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nossa Equipe</h2>
            <p className="mobile-text-lg md:text-xl text-gray-600">
              Profissionais especializados e apaixonados pelo que fazem
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                role: "Cirurgiões-Dentistas",
                count: "15+",
                description: "Especialistas em todas as áreas da odontologia",
                icon: "👨‍⚕️"
              },
              {
                role: "Técnicos em Saúde Bucal",
                count: "8+", 
                description: "Profissionais qualificados para auxiliar nos tratamentos",
                icon: "👩‍⚕️"
              },
              {
                role: "Atendimento",
                count: "12+",
                description: "Equipe dedicada ao melhor atendimento ao cliente",
                icon: "🤝"
              },
              {
                role: "Gestão",
                count: "5+",
                description: "Liderança focada na excelência operacional",
                icon: "📊"
              }
            ].map((team, index) => (
              <Card key={index} className="text-center mobile-card-spacing">
                <CardHeader>
                  <div className="text-4xl mb-4">{team.icon}</div>
                  <CardTitle className="mobile-text-lg md:text-xl">{team.role}</CardTitle>
                  <Badge variant="secondary" className="mobile-text-lg md:text-2xl font-bold">
                    {team.count}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mobile-text-sm">{team.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="mobile-container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Faça Parte da Nossa História
          </h2>
          <p className="mobile-text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Junte-se aos milhares de pacientes que já transformaram seus sorrisos 
            conosco. Agende sua avaliação gratuita e descubra como podemos ajudar você.
          </p>
          
          <Button 
            size="lg" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mobile-button-lg"
          >
            Começar Minha Transformação
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
