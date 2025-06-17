
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Calendar, TrendingUp, DollarSign } from 'lucide-react';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className={`border-blue-200 ${animations.slideInLeft}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Agendamentos</p>
              <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
            </div>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-green-200 ${animations.slideInLeft}`} style={{ animationDelay: '100ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Clínicas Ativas</p>
              <p className="text-2xl font-bold text-green-600">{totalClinics}</p>
            </div>
            <Building2 className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-purple-200 ${animations.slideInLeft}`} style={{ animationDelay: '200ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-orange-200 ${animations.slideInLeft}`} style={{ animationDelay: '300ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Taxa Conversão</p>
              <p className="text-2xl font-bold text-orange-600">{conversionRate}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
