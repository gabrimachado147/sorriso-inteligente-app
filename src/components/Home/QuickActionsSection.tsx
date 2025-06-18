
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, MapPin, Phone, Star, Clock, Users } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { useUserBehaviorTracking } from '@/hooks/useUserBehaviorTracking';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';

export const QuickActionsSection: React.FC = () => {
  const { 
    handleScheduleNavigation, 
    handleChatNavigation, 
    handleClinicsNavigation,
    handleEmergencyNavigation 
  } = useHomeNavigation();
  const { trackClick } = useUserBehaviorTracking();

  const quickActions = [
    { 
      icon: Calendar, 
      title: 'Agendar Consulta', 
      subtitle: 'Marque sua avaliação',
      description: 'Sistema inteligente de agendamento',
      color: 'bg-blue-500',
      badge: 'Gratuito',
      onClick: () => {
        trackClick('quick_action_schedule', { section: 'quick_actions' });
        handleScheduleNavigation();
      }
    },
    { 
      icon: MessageCircle, 
      title: 'Chat IA', 
      subtitle: 'Assistente virtual',
      description: 'Tire dúvidas 24/7',
      color: 'bg-green-500',
      badge: 'Online',
      onClick: () => {
        trackClick('quick_action_chat', { section: 'quick_actions' });
        handleChatNavigation();
      }
    },
    { 
      icon: MapPin, 
      title: 'Nossas Clínicas', 
      subtitle: '5 unidades',
      description: 'Encontre a mais próxima',
      color: 'bg-purple-500',
      badge: 'Localização',
      onClick: () => {
        trackClick('quick_action_clinics', { section: 'quick_actions' });
        handleClinicsNavigation();
      }
    },
    { 
      icon: Phone, 
      title: 'Emergência', 
      subtitle: 'Atendimento urgente',
      description: 'Suporte 24 horas',
      color: 'bg-red-500',
      badge: '24h',
      onClick: () => {
        trackClick('quick_action_emergency', { section: 'quick_actions' });
        handleEmergencyNavigation();
      }
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${animations.fadeIn}`}>
            Acesso Rápido aos Nossos Serviços
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${animations.fadeIn}`} 
             style={{ animationDelay: '200ms' }}>
            Tudo que você precisa para cuidar do seu sorriso, de forma simples e intuitiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <InteractiveFeedback 
                key={action.title}
                feedbackType="scale"
              >
                <Card 
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden group ${animations.fadeInUp}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={action.onClick}
                >
                  <CardContent className="p-6 text-center relative">
                    {/* Badge flutuante */}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700 border-0 shadow-sm">
                      {action.badge}
                    </Badge>
                    
                    {/* Ícone com efeito hover */}
                    <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Título e descrição */}
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {action.subtitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                    
                    {/* Indicador visual de ação */}
                    <div className="mt-4 w-8 h-1 bg-primary rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              </InteractiveFeedback>
            );
          })}
        </div>

        {/* Estatísticas de uso */}
        <div className={`mt-16 ${animations.fadeIn}`} style={{ animationDelay: '600ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InteractiveFeedback feedbackType="glow">
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-600">Satisfação dos pacientes</p>
                </CardContent>
              </Card>
            </InteractiveFeedback>

            <InteractiveFeedback feedbackType="glow">
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900">< 1h</span>
                  </div>
                  <p className="text-sm text-gray-600">Tempo médio de resposta</p>
                </CardContent>
              </Card>
            </InteractiveFeedback>

            <InteractiveFeedback feedbackType="glow">
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900">10k+</span>
                  </div>
                  <p className="text-sm text-gray-600">Pacientes atendidos</p>
                </CardContent>
              </Card>
            </InteractiveFeedback>
          </div>
        </div>
      </div>
    </section>
  );
};
