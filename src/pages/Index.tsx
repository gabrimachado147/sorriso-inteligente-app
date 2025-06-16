
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, MapPin, Phone, Star, Clock, Users } from 'lucide-react';
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
      icon: Calendar,
      title: "Agendar",
      description: "Marque sua consulta rapidamente",
      buttonText: "Novo Agendamento",
      path: "/schedule",
      variant: "default" as const
    },
    {
      icon: MessageCircle,
      title: "Chat IA",
      description: "Tire suas dúvidas conosco",
      buttonText: "Iniciar Chat",
      path: "/chat",
      variant: "outline" as const
    },
    {
      icon: MapPin,
      title: "Unidades",
      description: "Encontre a unidade mais próxima",
      buttonText: "Ver Locais",
      path: "/clinics",
      variant: "outline" as const
    },
    {
      icon: Phone,
      title: "Emergência",
      description: "Contato para urgências",
      buttonText: "Contatar Agora",
      path: "",
      variant: "destructive" as const,
      isEmergency: true
    }
  ];

  const featuredClinics = [
    {
      name: 'Campo Belo - MG',
      address: 'Av. Afonso Pena, 151, Centro',
      phone: '(35) 99891-3803'
    },
    {
      name: 'Formiga - MG', 
      address: 'R. Barão de Piumhy, 198, Centro',
      phone: '(37) 3443-0520'
    }
  ];

  const stats = [
    { icon: Users, label: 'Pacientes Atendidos', value: '10.000+' },
    { icon: Star, label: 'Satisfação', value: '98%' },
    { icon: Clock, label: 'Anos de Experiência', value: '15+' },
    { icon: Calendar, label: 'Consultas/Mês', value: '500+' }
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full space-y-8">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-white py-16 px-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg">
                <img 
                  src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                  alt="Senhor Sorriso Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Senhor Sorriso
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Cuidando do seu sorriso com carinho e profissionalismo
            </p>

            {user && (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-8 inline-block">
                <p className="text-lg font-medium">
                  Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => handleNavigate('/schedule')}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Avaliação Gratuita
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                onClick={() => handleNavigate('/clinics')}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Ver Nossas Unidades
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                    <CardContent className="p-4 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                      <div className="text-xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs text-blue-200">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Acesso Rápido</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const isEmergency = action.isEmergency;
                
                return (
                  <Card 
                    key={action.title}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      isEmergency ? 'border-red-200 bg-red-50' : ''
                    }`}
                    onClick={() => isEmergency ? handleEmergencyCall() : handleNavigate(action.path)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isEmergency ? 'bg-red-500' : 'bg-primary'
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                      <Button 
                        variant={action.variant}
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          isEmergency ? handleEmergencyCall() : handleNavigate(action.path);
                        }}
                      >
                        {action.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clinics Section */}
        <section className="py-8 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Nossas Unidades</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {featuredClinics.map((clinic) => (
                <Card key={clinic.name} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {clinic.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{clinic.address}</p>
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleNavigate('/schedule')}
                        className="flex-1"
                      >
                        Agendar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${clinic.phone}`, '_self')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => handleNavigate('/clinics')}
                className="px-8"
              >
                Ver todas as unidades
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Pronto para cuidar do seu sorriso?
                </h2>
                
                <p className="text-xl text-gray-600 mb-8">
                  Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="text-lg px-10 py-4" 
                    onClick={() => handleNavigate('/schedule')}
                  >
                    Agendar Consulta
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-4" 
                    onClick={handleWhatsAppContact}
                  >
                    Falar no WhatsApp
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
