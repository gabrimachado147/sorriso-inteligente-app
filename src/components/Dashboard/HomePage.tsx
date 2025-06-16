
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastSuccess, toastInfo, toastAppointment, toastCall } from '@/components/ui/custom-toast';
import { useAppointmentScheduler } from '@/hooks/useAppointmentScheduler';
import { useChatHandler } from '@/hooks/useChatHandler';
import { animations } from '@/lib/animations';
import { Calendar, MessageCircle, Clock, Star, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReschedule = () => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

  const handleViewUnits = () => {
    navigate('/clinics');
  };

  const handleScheduleClinic = (clinic: string, phone: string) => {
    navigate('/schedule');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleServiceSelect = (service: string) => {
    toastInfo('Serviço selecionado', `Você selecionou: ${service}`);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'chat':
        navigate('/chat');
        break;
      case 'locations':
        navigate('/clinics');
        break;
      case 'appointments':
        navigate('/schedule');
        break;
      case 'emergency':
        navigate('/emergency');
        break;
      default:
        toastInfo('Ação rápida', `Ação: ${action}`);
    }
  };

  const handleScheduleEvaluation = () => {
    toastSuccess('Agendamento', 'Avaliação gratuita agendada!');
  };

  const handleEmergencyCall = () => {
    navigate('/emergency');
  };

  const schedulingLoading = false;
  const chatLoading = false;

  return (
    <div className={`p-4 space-y-6 ${animations.pageEnter}`}>
      {/* Hero Section */}
      <Card className={`bg-gradient-to-r from-primary to-blue-600 text-white ${animations.fadeIn}`}>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo à Senhor Sorriso!</h1>
          <p className="mb-4 opacity-90">Seu sorriso perfeito está a um clique de distância</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className={`bg-white text-primary hover:bg-gray-100 ${animations.buttonHover}`}
              onClick={handleScheduleEvaluation}
              disabled={schedulingLoading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {schedulingLoading ? 'Agendando...' : 'Agendar Avaliação Gratuita'}
            </Button>
            <Button 
              variant="outline"
              className={`bg-transparent border-white text-white hover:bg-white hover:text-primary ${animations.buttonHover}`}
              onClick={handleViewUnits}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Ver Nossas Unidades
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${animations.slideInBottom}`}>
        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('chat')}
        >
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Chat IA</p>
            <p className="text-xs text-gray-500">Tire suas dúvidas</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('locations')}
        >
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Unidades</p>
            <p className="text-xs text-gray-500">5 cidades</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('appointments')}
        >
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Agendar</p>
            <p className="text-xs text-gray-500">Nova consulta</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('emergency')}
        >
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Urgência</p>
            <p className="text-xs text-gray-500">Contato emergência</p>
          </CardContent>
        </Card>
      </div>

      {/* Nossas Unidades - ENDEREÇOS CORRIGIDOS */}
      <Card className={animations.slideInLeft}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Nossas Unidades
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleViewUnits}
              className={animations.buttonHover}
            >
              Ver todas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}> 
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Campo Belo - MG</p>
                  <p className="text-sm text-gray-600">Av. Afonso Pena, 151</p>
                  <p className="text-xs text-gray-500">(35) 99869-5479</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleScheduleClinic('Campo Belo', '(35) 99869-5479')}
                  className={animations.buttonHover}
                >
                  Agendar
                </Button>
              </div>
            </div>
            
            <div className={`p-3 bg-green-50 rounded-lg ${animations.cardHover}`}> 
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Formiga - MG</p>
                  <p className="text-sm text-gray-600">R. Barão de Piumhy, 198</p>
                  <p className="text-xs text-gray-500">(35) 9969-5479</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleScheduleClinic('Formiga', '(35) 9969-5479')}
                  className={animations.buttonHover}
                >
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Consultas */}
      <Card className={animations.slideInRight}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}> 
              <div>
                <p className="font-medium">Limpeza Dental</p>
                <p className="text-sm text-gray-600">Campo Belo - Dr. Silva</p>
                <p className="text-xs text-gray-500">15/06/2024 às 14:00</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleReschedule}
                className={animations.buttonHover}
              >
                Remarcar
              </Button>
            </div>
            
            <div className="text-center py-4">
              <Button 
                variant="ghost" 
                className={`text-primary ${animations.buttonHover}`}
                onClick={handleViewAllAppointments}
              >
                Ver todas as consultas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Serviços em Destaque */}
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle>Nossos Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Avaliação Gratuita', icon: '🔍', popular: true },
              { name: 'Limpeza Dental', icon: '🦷', popular: false },
              { name: 'Ortodontia', icon: '😬', popular: true },
              { name: 'Implantodontia', icon: '🔧', popular: false },
              { name: 'Clareamento', icon: '✨', popular: true },
              { name: 'Atendimento Urgência', icon: '🚨', popular: false },
            ].map((service, index) => (
              <Card 
                key={service.name} 
                className={`relative hover:shadow-md transition-shadow cursor-pointer ${animations.cardHover} ${animations.scaleIn}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleServiceSelect(service.name)}
              >
                {service.popular && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <CardContent className="p-3 text-center">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <p className="text-sm font-medium">{service.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avaliações */}
      <Card className={animations.slideInBottom}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Avaliações de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-3 bg-gray-50 rounded-lg ${animations.cardHover}`}> 
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="ml-2 font-medium">Maria Silva</span>
              </div>
              <p className="text-sm text-gray-600">
                "Excelente atendimento! A avaliação gratuita me surpreendeu pela qualidade."
              </p>
            </div>
            
            <div className={`p-3 bg-gray-50 rounded-lg ${animations.cardHover}`}> 
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="ml-2 font-medium">João Santos</span>
              </div>
              <p className="text-sm text-gray-600">
                "Equipe muito profissional e clínica moderna. Recomendo!"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato de Emergência */}
      <Card className={`bg-red-50 border-red-200 ${animations.fadeIn}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800">Urgência Dental</h3>
              <p className="text-sm text-red-600">Atendimento para emergências odontológicas</p>
            </div>
            <Button 
              className={`bg-red-600 hover:bg-red-700 ${animations.buttonHover}`}
              onClick={handleEmergencyCall}
              disabled={chatLoading}
            >
              <Phone className="h-4 w-4 mr-2" />
              {chatLoading ? 'Conectando...' : 'Contatar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
