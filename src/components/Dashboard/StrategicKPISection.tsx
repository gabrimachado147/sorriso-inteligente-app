
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, Heart, Zap, Star } from 'lucide-react';
import { animations } from '@/lib/animations';

interface StrategicKPISectionProps {
  totalAppointments: number;
  conversionRate: number;
  totalRevenue: number;
  todayAppointments: number;
}

export const StrategicKPISection: React.FC<StrategicKPISectionProps> = ({
  totalAppointments,
  conversionRate,
  totalRevenue,
  todayAppointments
}) => {
  const kpis = [
    {
      title: 'Sorrisos Agendados Hoje',
      value: todayAppointments,
      subtitle: 'consultas confirmadas',
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-blue-100',
      badge: todayAppointments > 0 ? 'Ativo' : 'Sem agendamentos',
      badgeColor: todayAppointments > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
    },
    {
      title: 'Taxa de Felicidade',
      value: `${conversionRate}%`,
      subtitle: 'pacientes confirmados',
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-500 to-red-500',
      iconColor: 'text-pink-100',
      badge: conversionRate > 70 ? 'Excelente' : conversionRate > 50 ? 'Bom' : 'Melhorar',
      badgeColor: conversionRate > 70 ? 'bg-green-100 text-green-800' : conversionRate > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
    },
    {
      title: 'Investimento em Sorrisos',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'receita acumulada',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      iconColor: 'text-green-100',
      badge: 'Crescendo',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      title: 'Total de Agendamentos',
      value: totalAppointments,
      subtitle: 'vidas impactadas',
      icon: Users,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      iconColor: 'text-purple-100',
      badge: totalAppointments > 100 ? 'Alto Volume' : 'Crescimento',
      badgeColor: totalAppointments > 100 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Título da Seção */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          KPIs Estratégicos - Sua Clínica em Números
        </h2>
        <p className="text-gray-600">
          Acompanhe o impacto do seu trabalho em tempo real
        </p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={kpi.title}
              className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${animations.slideInLeft}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className={`${kpi.color} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <Icon className={`h-8 w-8 ${kpi.iconColor}`} />
                  <Badge className={kpi.badgeColor}>
                    {kpi.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </CardTitle>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {kpi.title}
                </p>
                <p className="text-xs text-gray-500">
                  {kpi.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-500">Atualizado agora</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem Motivacional */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-gray-800">Mensagem de Impacto</span>
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-gray-700 font-medium">
            "Cada número aqui representa uma vida transformada pelo seu cuidado. 
            Continue fazendo a diferença, um sorriso por vez! 🦷✨"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
