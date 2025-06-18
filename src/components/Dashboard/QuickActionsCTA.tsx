
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { animations } from '@/lib/animations';

interface QuickActionsCTAProps {
  onNavigateToAppointments: () => void;
  onNavigateToPatients: () => void;
  onNavigateToReports: () => void;
  onNavigateToMessages: () => void;
  urgentCount?: number;
}

export const QuickActionsCTA: React.FC<QuickActionsCTAProps> = ({
  onNavigateToAppointments,
  onNavigateToPatients,
  onNavigateToReports,
  onNavigateToMessages,
  urgentCount = 0
}) => {
  const quickActions = [
    {
      title: 'Agendar Consulta',
      description: 'Novo agendamento em segundos',
      icon: Calendar,
      onClick: onNavigateToAppointments,
      color: 'from-blue-500 to-blue-600',
      urgent: false,
      cta: 'Agendar Agora'
    },
    {
      title: 'Gerenciar Pacientes',
      description: 'Visualizar e editar informações',
      icon: Users,
      onClick: onNavigateToPatients,
      color: 'from-green-500 to-emerald-600',
      urgent: false,
      cta: 'Ver Pacientes'
    },
    {
      title: 'Relatórios Inteligentes',
      description: 'Insights para crescer sua clínica',
      icon: FileText,
      onClick: onNavigateToReports,
      color: 'from-purple-500 to-indigo-600',
      urgent: false,
      cta: 'Gerar Relatório'
    },
    {
      title: 'Central de Mensagens',
      description: 'Comunicação eficiente com pacientes',
      icon: MessageSquare,
      onClick: onNavigateToMessages,
      color: 'from-pink-500 to-red-500',
      urgent: urgentCount > 0,
      cta: 'Abrir Central',
      urgentBadge: urgentCount
    }
  ];

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Título da Seção */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          Ações Rápidas - Maximize sua Eficiência
        </h2>
        <p className="text-gray-600">
          Acesse as funcionalidades mais importantes com um clique
        </p>
      </div>

      {/* Grid de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.title}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden ${animations.slideInLeft}`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={action.onClick}
            >
              <CardHeader className={`bg-gradient-to-br ${action.color} text-white p-4 relative`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8" />
                  {action.urgent && action.urgentBadge && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Bell className="h-3 w-3 mr-1" />
                      {action.urgentBadge}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-all duration-300"
                  variant="default"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {action.cta}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Seção de Dicas Rápidas */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dica Inteligente do Dia
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            💡 <strong>Produtividade em Foco:</strong> Use os atalhos de teclado para navegar mais rapidamente: 
            <code className="bg-white px-2 py-1 rounded ml-2 text-sm">Ctrl + 1</code> para Agendamentos,
            <code className="bg-white px-2 py-1 rounded ml-2 text-sm">Ctrl + 2</code> para Pacientes.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Zap className="h-4 w-4" />
            <span>Sistema otimizado com React + TypeScript + Supabase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
