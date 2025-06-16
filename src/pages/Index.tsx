
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, MapPin, Phone, Star, Clock, Users, Search, Sparkles, Wrench, Smile, Settings, Crown, Stethoscope, Baby, Shield, AlertTriangle } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEmergencyCall = () => {
    window.open('tel:+5515997123456', '_self');
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta na Senhor Sorriso.');
    window.open(`https://wa.me/5515997123456?text=${message}`, '_blank');
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Chat IA",
      description: "Tire suas dúvidas",
      path: "/chat"
    },
    {
      icon: MapPin,
      title: "Unidades",
      description: "5 cidades",
      path: "/clinics"
    },
    {
      icon: Calendar,
      title: "Agendar",
      description: "Nova consulta",
      path: "/schedule"
    },
    {
      icon: Phone,
      title: "Urgência",
      description: "Contato emergência",
      path: "",
      isEmergency: true
    }
  ];

  const featuredClinics = [
    {
      name: 'Campo Belo - MG',
      address: 'Av. Afonso Pena, 151, Centro'
    },
    {
      name: 'Formiga - MG', 
      address: 'R. Barão de Piumhy, 198, Centro'
    }
  ];

  const services = [
    { icon: Search, name: 'Avaliação Gratuita', popular: true },
    { icon: Sparkles, name: 'Limpeza', popular: true },
    { icon: Wrench, name: 'Restauração', popular: false },
    { icon: Smile, name: 'Ortodontia', popular: true },
    { icon: Settings, name: 'Implantodontia', popular: false },
    { icon: Sparkles, name: 'Estética Dental', popular: true },
    { icon: Crown, name: 'Próteses Fixas', popular: false },
    { icon: Stethoscope, name: 'Endodontia', popular: false },
    { icon: Baby, name: 'Odontopediatria', popular: false },
    { icon: Shield, name: 'Periodontia', popular: false },
    { icon: AlertTriangle, name: 'Atendimento de Urgência', popular: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full space-y-8">
        {/* Hero Section - Rounded Design */}
        <section className="px-6 pt-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 text-white p-8 md:p-12 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
              
              <div className="relative text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  Bem-vindo à Senhor Sorriso!
                </h1>
                
                <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Seu sorriso perfeito está a um clique de distância
                </p>

                {user && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-8 inline-block">
                    <p className="text-lg font-medium">
                      Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-4 max-w-md mx-auto">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-2xl font-semibold w-full"
                    onClick={() => handleNavigate('/schedule')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Avaliação Gratuita
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-2xl font-semibold w-full"
                    onClick={() => handleNavigate('/clinics')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Ver Nossas Unidades
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const isEmergency = action.isEmergency;
                
                return (
                  <Card 
                    key={action.title}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center ${
                      isEmergency ? 'border-red-200 bg-red-50' : ''
                    }`}
                    onClick={() => isEmergency ? handleEmergencyCall() : handleNavigate(action.path)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isEmergency ? 'bg-red-500' : 'bg-primary'
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clinics Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 mr-3" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nossas Unidades
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
              {featuredClinics.map((clinic) => (
                <Card key={clinic.name} className="hover:shadow-lg transition-shadow border-gray-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{clinic.name}</h3>
                    <p className="text-gray-600 mb-6 text-lg">{clinic.address}</p>
                    <Button 
                      size="lg" 
                      onClick={() => handleNavigate('/schedule')}
                      className="w-full rounded-2xl text-lg py-4 px-8"
                    >
                      Agendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => handleNavigate('/clinics')}
                className="px-8 py-3 text-lg rounded-xl"
              >
                Ver todas as unidades
              </Button>
            </div>
          </div>
        </section>

        {/* Login Section */}
        {!user && (
          <section className="py-8 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 mr-3" />
                Próximas Consultas
              </h2>
              
              <Card className="mb-8">
                <CardContent className="p-8">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Faça login para ver suas consultas</p>
                  <Button onClick={() => handleNavigate('/auth')}>
                    Fazer Login
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section className="py-8 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Nossos Serviços</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card 
                    key={service.name}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center relative"
                    onClick={() => handleNavigate('/schedule')}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold">{service.name}</h3>
                      
                      {service.popular && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1"
                        >
                          Popular
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 mr-3" />
              Avaliações
            </h2>
            
            {!user ? (
              <Card>
                <CardContent className="p-8">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Faça login para compartilhar sua experiência</p>
                  <Button onClick={() => handleNavigate('/auth')}>
                    Fazer Login para Avaliar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <Star className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 mb-4">Compartilhe sua experiência conosco</p>
                  <Button>Avaliar Atendimento</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Emergency Section */}
        <section className="py-8 px-6 bg-red-50">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Urgência Dental</h3>
                    <p className="text-red-700">Atendimento para emergências odontológicas</p>
                  </div>
                  <Button 
                    variant="destructive"
                    size="lg"
                    onClick={handleEmergencyCall}
                    className="ml-4"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Contatar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
