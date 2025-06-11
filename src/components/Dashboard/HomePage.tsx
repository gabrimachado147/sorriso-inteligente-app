import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PWADashboard, PWAQuickInstall } from '@/components/ui/pwa-dashboard';
import { toastSuccess, toastInfo, toastAppointment, toastCall } from '@/components/ui/custom-toast';
import { useAppointmentScheduler } from '@/hooks/useAppointmentScheduler';
import { useChatHandler } from '@/hooks/useChatHandler';
import { animations } from '@/lib/animations';
import { Calendar, MessageCircle, Clock, Star, Phone, MapPin } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { scheduleAppointment, loading: schedulingLoading } = useAppointmentScheduler();
  const { sendWhatsAppMessage, loading: chatLoading } = useChatHandler();

  const handleScheduleEvaluation = async () => {
    try {
      toastAppointment("Agendamento", "Redirecionando para avaliação gratuita...");
      onNavigate('appointments');
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  const handleViewUnits = () => {
    toastInfo("Unidades", "Carregando mapa de clínicas...");
    onNavigate('locations');
  };

  const handleOpenChat = async () => {
    try {
      toastInfo("Chat IA", "Iniciando conversa com assistente virtual...");
      onNavigate('chat');
    } catch (error) {
      console.error('Erro ao abrir chat:', error);
    }
  };

  const handleEmergencyCall = async () => {
    try {
      const emergencyNumber = import.meta.env.VITE_WA_BUSINESS_JID || '553171147487@s.whatsapp.net';
      await sendWhatsAppMessage(
        emergencyNumber, 
        'URGÊNCIA DENTAL: Preciso de atendimento de emergência. Por favor, me orientem sobre o procedimento.'
      );
      toastCall("Emergência", "Conectando com atendimento 24h...");
    } catch (error) {
      console.error('Erro ao chamar emergência:', error);
      // Fallback para chamada telefônica
      window.open('tel:+551199999-0000', '_self');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'chat':
        handleOpenChat();
        break;
      case 'locations':
        handleViewUnits();
        break;
      case 'appointments':
        handleScheduleEvaluation();
        break;
      case 'emergency':
        handleEmergencyCall();
        break;
      default:
        toastInfo("Ação", `Executando: ${action}`);
    }
  };

  const handleScheduleClinic = async (clinic: string, phone: string) => {
    try {
      await sendWhatsAppMessage(
        `55${phone.replace(/\D/g, '')}@s.whatsapp.net`,
        `Olá! Gostaria de agendar uma consulta na unidade ${clinic}. Poderiam me informar os horários disponíveis?`
      );
      toastAppointment("Agendamento", `Solicitação enviada para ${clinic}`);
    } catch (error) {
      console.error('Erro ao contatar clínica:', error);
      onNavigate('appointments');
    }
  };

  const handleReschedule = () => {
    toastInfo("Reagendamento", "Redirecionando para reagendamento...");
    onNavigate('profile');
  };

  const handleViewAllAppointments = () => {
    toastInfo("Consultas", "Carregando histórico de consultas...");
    onNavigate('profile');
  };

  const handleServiceSelect = (service: string) => {
    toastAppointment("Serviço", `Selecionando ${service}...`);
    onNavigate('appointments');
  };

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
            <p className="text-xs text-gray-700">Tire suas dúvidas</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('locations')}
        >
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Unidades</p>
            <p className="text-xs text-gray-700">5 cidades</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('appointments')}
        >
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Agendar</p>
            <p className="text-xs text-gray-700">Nova consulta</p>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-shadow cursor-pointer ${animations.cardHover}`}
          onClick={() => handleQuickAction('emergency')}
        >
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Urgência</p>
            <p className="text-xs text-gray-700">Atendimento 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Nossas Unidades - ENDEREÇOS CORRIGIDOS */}
      <Card className={animations.slideInLeft}>
        <CardHeader>
          <h2 className="flex items-center justify-between text-2xl font-semibold leading-none tracking-tight">
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
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Campo Belo - MG</p>
                  <p className="text-sm text-gray-600">Av. Afonso Pena, 151</p>
                  <p className="text-xs text-gray-700">(35) 99869-5479</p>
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
                  <p className="text-xs text-gray-700">(35) 9969-5479</p>
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
          <h2 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <Clock className="h-5 w-5 mr-2" />
            Próximas Consultas
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}>
              <div>
                <p className="font-medium">Limpeza Dental</p>
                <p className="text-sm text-gray-600">Campo Belo - Dr. Silva</p>
                <p className="text-xs text-gray-700">15/06/2024 às 14:00</p>
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
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Nossos Serviços</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Avaliação Gratuita', icon: '🔍', popular: true },
              { name: 'Limpeza Dental', icon: '🦷', popular: false },
              { name: 'Ortodontia', icon: '😬', popular: true },
              { name: 'Implantodontia', icon: '🔧', popular: false },
              { name: 'Clareamento', icon: '✨', popular: true },
              { name: 'Urgência 24h', icon: '🚨', popular: false },
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
          <h2 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Avaliações de Pacientes
          </h2>
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
              <h3 className="font-semibold text-red-800">Urgência Dental 24h</h3>
              <p className="text-sm text-red-700">Atendimento imediato para emergências</p>
            </div>
            <Button 
              className={`bg-red-600 hover:bg-red-700 ${animations.buttonHover}`}
              onClick={handleEmergencyCall}
              disabled={chatLoading}
            >
              <Phone className="h-4 w-4 mr-2" />
              {chatLoading ? 'Conectando...' : 'Ligar Agora'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA Dashboard */}
      <PWADashboard onInstall={() => toastSuccess("App Instalado", "Sorriso Inteligente foi instalado com sucesso!")} />

      {/* PWA Quick Install Prompt */}
      <PWAQuickInstall />
    </div>
  );
};
