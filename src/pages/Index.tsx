
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, MapPin, Heart, Clock, Star, Phone } from "lucide-react";
import { toastInfo } from "@/components/ui/custom-toast";
import { animations } from "@/lib/animations";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { availableServices } from "@/components/Appointments/constants/services";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEmergencyCall = () => {
    toastInfo("Emergência", "Conectando você com atendimento de emergência...");
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, "_blank");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre os serviços.");
    window.open(`https://wa.me/5531971147487?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className={`text-center space-y-4 ${animations.fadeIn}`}>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Senhor Sorriso
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cuidando do seu sorriso com carinho e profissionalismo. 
            Agendamentos fáceis, atendimento de qualidade.
          </p>
          {user && (
            <p className="text-lg text-primary font-medium">
              Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email}! 😊
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${animations.slideInLeft}`}>
          <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
                onClick={() => handleNavigation('/appointments')}>
            <CardHeader className="text-center pb-2">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Agendar</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Marque sua consulta rapidamente
              </p>
              <Button className="w-full" onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/appointments');
              }}>
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>

          <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
                onClick={() => handleNavigation('/chat')}>
            <CardHeader className="text-center pb-2">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Tire suas dúvidas conosco
              </p>
              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/chat');
              }}>
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className={`${animations.cardHover} border-primary/20 hover:border-primary/40 transition-all cursor-pointer`}
                onClick={() => handleNavigation('/locations')}>
            <CardHeader className="text-center pb-2">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Unidades</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Encontre a unidade mais próxima
              </p>
              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation();
                handleNavigation('/locations');
              }}>
                Ver Locais
              </Button>
            </CardContent>
          </Card>

          <Card className={`${animations.cardHover} border-red-200 hover:border-red-400 transition-all bg-red-50 cursor-pointer`}
                onClick={handleEmergencyCall}>
            <CardHeader className="text-center pb-2">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg text-red-600">Emergência</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Atendimento 24h disponível
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmergencyCall();
                }}
              >
                Contatar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Services Overview - TODOS OS SERVIÇOS */}
        <div className={`space-y-6 ${animations.slideInRight}`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Nossos Serviços</h2>
            <p className="text-muted-foreground">Tratamentos completos para toda a família</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableServices.map((service, index) => (
              <Card key={service.id} className={`${animations.cardHover} h-full cursor-pointer relative`}
                    onClick={() => handleNavigation('/appointments')}>
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-3 text-primary">
                    {service.icon}
                  </div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/appointments');
                    }}
                  >
                    Agendar
                  </Button>
                </CardContent>
                
                {/* Badge para serviços populares */}
                {['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental', 'urgencia'].includes(service.id) && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1"
                  >
                    Popular
                  </Badge>
                )}
                
                {/* Badge para urgência */}
                {service.id === 'urgencia' && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1"
                  >
                    24h
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center space-y-4 ${animations.scaleIn}`}>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">
                Pronto para cuidar do seu sorriso?
              </CardTitle>
              <CardDescription className="text-lg">
                Agende sua consulta hoje mesmo e dê o primeiro passo para um sorriso mais saudável e bonito.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => handleNavigation('/appointments')}>
                  Agendar Consulta
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" onClick={handleWhatsAppContact}>
                  Falar no WhatsApp
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Resposta rápida</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>5 estrelas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Atendimento humanizado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
