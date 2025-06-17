
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Activity, Clock, XCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface DashboardChartsProps {
  monthlyData: Array<{ month: string; agendamentos: number; conversoes: number }>;
  servicesData: Array<{ name: string; value: number; color: string }>;
  statusData: Array<{ name: string; value: number; color: string }>;
  confirmedAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  monthlyData,
  servicesData,
  statusData,
  confirmedAppointments,
  completedAppointments,
  pendingAppointments,
  cancelledAppointments
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="agendamentos" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="conversoes" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Distribuição de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {servicesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {servicesData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados de serviços
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700">Status dos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados de status
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-700">Métricas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Confirmados</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {confirmedAppointments}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span>Concluídos</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {completedAppointments}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>Pendentes</span>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {pendingAppointments}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Cancelados</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {cancelledAppointments}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
