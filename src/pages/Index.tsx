import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { toastSuccess, toastAppointment, toastInfo, toastCall } from "@/components/ui/custom-toast";
import { useAppointmentScheduler } from "@/hooks/useAppointmentScheduler";
import { useChatHandler } from "@/hooks/useChatHandler";
import { animations } from "@/lib/animations";
import { Calendar, Clock, MapPin, MessageCircle, Phone, Heart, Star, Users, Award } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { scheduleAppointment, loading: schedulingLoading } = useAppointmentScheduler();
  const { sendMessage, sendWhatsAppMessage, loading: chatLoading } = useChatHandler();

  const upcomingAppointments = [
    {
      id: 1,
      service: "Limpeza Dental",
      date: "15/06/2024",
      time: "14:30",
      clinic: "Clínica Centro",
      status: "confirmed" as const,
      doctor: "Dr. João Silva"
    },
    {
      id: 2,
      service: "Consulta de Rotina",
      date: "20/06/2024", 
      time: "09:00",
      clinic: "Clínica Zona Sul",
      status: "pending" as const,
      doctor: "Dra. Maria Santos"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Consulta realizada",
      description: "Limpeza dental na Clínica Norte",
      date: "10/06/2024",
      icon: Calendar
    },
    {
      id: 2,
      action: "Agendamento confirmado",
      description: "Consulta de rotina para 15/06",
      date: "08/06/2024",
      icon: Clock
    }
  ];

  const quickActions = [
    {
      title: "Agendar Consulta",
      description: "Marque uma nova consulta",
      icon: Calendar,
      action: async () => {
        toastAppointment("Redirecionando...", "Abrindo página de agendamento");
        // Simular navegação para página de agendamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        toastSuccess("Agendamento", "Página de agendamento carregada!");
      }
    },
    {
      title: "Encontrar Clínicas",
      description: "Localize clínicas próximas",
      icon: MapPin,
      action: async () => {
        toastInfo("Redirecionando...", "Abrindo mapa de clínicas");
        // Simular carregamento de clínicas
        await new Promise(resolve => setTimeout(resolve, 800));
        toastInfo("Clínicas", "5 clínicas encontradas próximas a você!");
      }
    },
    {
      title: "Chat de Suporte",
      description: "Fale com nosso assistente",
      icon: MessageCircle,
      action: async () => {
        try {
          await sendMessage("Olá! Preciso de ajuda com agendamento.", "general");
          toastInfo("Chat iniciado", "Nosso assistente está pronto para ajudar!");
        } catch (error) {
          toastInfo("Chat", "Iniciando chat com assistente...");
        }
      }
    },
    {
      title: "Emergência",
      description: "Atendimento urgente",
      icon: Phone,
      action: async () => {
        try {
          const emergencyNumber = import.meta.env.VITE_WA_BUSINESS_JID || '553171147487@s.whatsapp.net';
          await sendWhatsAppMessage(
            emergencyNumber,
            'URGÊNCIA DENTAL: Preciso de atendimento de emergência imediato!'
          );
          toastCall("Emergência", "Conectando com atendimento de emergência...");
        } catch (error) {
          // Fallback para chamada telefônica
          window.open('tel:+551199999-0000', '_self');
          toastCall("Emergência", "Discando para emergência...");
        }
      }
    }
  ];

  const stats = [
    { label: "Consultas Realizadas", value: "12", icon: Calendar, color: "text-blue-600" },
    { label: "Próximas Consultas", value: "2", icon: Clock, color: "text-green-600" },
    { label: "Clínicas Visitadas", value: "3", icon: MapPin, color: "text-purple-600" },
    { label: "Avaliação Média", value: "4.8", icon: Star, color: "text-yellow-600" }
  ];

  const handleQuickAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleReschedule = async (appointmentId: number) => {
    try {
      toastInfo("Reagendamento", "Processando reagendamento...");
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toastSuccess("Reagendado", "Consulta reagendada com sucesso!");
    } catch (error) {
      console.error('Erro ao reagendar:', error);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      toastInfo("Cancelamento", "Processando cancelamento...");
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toastSuccess("Cancelado", "Consulta cancelada com sucesso!");
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    }
  };

  const handleNewAppointment = async () => {
    try {
      const mockAppointment = {
        service: "Consulta de Avaliação",
        clinic: "Clínica Centro",
        date: "25/06/2024",
        time: "10:00",
        userInfo: {
          name: "Usuário Teste",
          phone: "11999999999",
          email: "teste@email.com"
        }
      };

      await scheduleAppointment(mockAppointment);
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  const handleViewHistory = () => {
    toastInfo("Histórico", "Carregando histórico completo de atividades...");
  };

  const handleStartChat = async () => {
    try {
      await sendMessage("Olá! Preciso de ajuda com meus agendamentos.", "general");
      toastInfo("Chat", "Conectando com suporte...");
    } catch (error) {
      toastInfo("Chat", "Iniciando chat...");
    }
  };

  const handleCallNow = async () => {
    try {
      const phoneNumber = import.meta.env.VITE_WA_BUSINESS_JID || '553171147487@s.whatsapp.net';
      await sendWhatsAppMessage(phoneNumber, 'Gostaria de falar com um atendente. Estou com dúvidas sobre meus agendamentos.');
      toastCall("Ligação", "Conectando via WhatsApp...");
    } catch (error) {
      // Fallback para chamada telefônica
      window.open('tel:+5511999999999', '_self');
      toastCall("Ligação", "Discando para (11) 99999-9999...");
    }
  };

  const whatsappKey = import.meta.env.VITE_N8N_WEBHOOK_URL;

  const apiUrl = import.meta.env.API_URL;
  if (!apiUrl) {
    console.error('API_URL is not defined in environment variables');
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="clinic-card" count={2} />
        <EnhancedSkeleton variant="appointment-card" count={3} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn} flex items-center justify-between`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h1>
          <p className="text-gray-600 mt-1">Gerencie suas consultas odontológicas</p>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-sm text-gray-600">Cuidando do seu sorriso</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${animations.slideInBottom}`}>
        {stats.map((stat, index) => (
          <Card key={index} className={`${animations.cardHover} ${animations.fadeIn}`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className={`${animations.slideInLeft} ${animations.cardHover}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-3 ${animations.buttonHover} ${animations.scaleIn}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleQuickAction(action.action)}
                disabled={isLoading || chatLoading || schedulingLoading}
              >
                <action.icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className={`${animations.slideInLeft} ${animations.cardHover}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className={`p-4 border rounded-lg ${animations.fadeIn} ${animations.cardHover}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.service}</h3>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                  </div>
                  <StatusBadge status={appointment.status} size="sm" />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {appointment.clinic}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={animations.buttonHover}
                    onClick={() => handleReschedule(appointment.id)}
                  >
                    Remarcar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={animations.buttonHover}
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}

            <Button 
              className={`w-full ${animations.buttonHover}`}
              onClick={handleNewAppointment}
              disabled={schedulingLoading}
            >
              {schedulingLoading ? 'Agendando...' : 'Agendar Nova Consulta'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className={`${animations.slideInRight} ${animations.cardHover}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 border rounded-lg ${animations.fadeIn} ${animations.cardHover}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.action}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              className={`w-full ${animations.buttonHover}`}
              onClick={handleViewHistory}
            >
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className={`${animations.fadeIn} border-primary/20 bg-primary/5`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Precisa de Ajuda?</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Nossa equipe está pronta para ajudar você com qualquer dúvida sobre seus agendamentos ou tratamentos.
          </p>
          <div className="flex gap-3">
            <Button 
              className={animations.buttonHover}
              onClick={handleStartChat}
              disabled={chatLoading}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {chatLoading ? 'Conectando...' : 'Iniciar Chat'}
            </Button>
            <Button 
              variant="outline" 
              className={animations.buttonHover}
              onClick={handleCallNow}
              disabled={chatLoading}
            >
              <Phone className="h-4 w-4 mr-2" />
              {chatLoading ? 'Conectando...' : 'Ligar Agora'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
