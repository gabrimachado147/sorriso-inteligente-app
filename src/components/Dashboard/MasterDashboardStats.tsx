
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { animations } from '@/lib/animations';

interface MasterDashboardStatsProps {
  totalAppointments: number;
  totalClinics: number;
  totalRevenue: number;
  conversionRate: number;
}

export const MasterDashboardStats: React.FC<MasterDashboardStatsProps> = ({
  totalAppointments,
  totalClinics,
  totalRevenue,
  conversionRate
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-x-hidden ${animations.fadeIn}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Agendamentos
          </CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalAppointments}</div>
          <p className="text-xs text-gray-500">
            Todos os agendamentos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Clínicas Ativas
          </CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalClinics}</div>
          <p className="text-xs text-gray-500">
            Unidades operando
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Receita Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-gray-500">
            Receita acumulada
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Taxa de Conversão
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{conversionRate}%</div>
          <p className="text-xs text-gray-500">
            Agendamentos confirmados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
