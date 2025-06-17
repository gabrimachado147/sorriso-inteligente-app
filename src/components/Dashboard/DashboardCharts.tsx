import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

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
  // Renderizar labels customizados no gráfico de pizza
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700 text-lg text-center">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart 
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tickMargin={5}
                />
                <YAxis 
                  fontSize={12}
                  tickMargin={5}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'agendamentos' ? 'Agendamentos' : 'Conversões'
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="agendamentos" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                />
                <Area 
                  type="monotone" 
                  dataKey="conversoes" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados mensais disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700 text-lg text-center">Distribuição de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {servicesData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Agendamentos']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 gap-2 text-sm max-h-32 overflow-y-auto">
                {servicesData.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="truncate flex-1" title={service.name}>
                      {service.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {service.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados de serviços
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-700 text-lg text-center">Status dos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{confirmedAppointments}</p>
                <p className="text-sm text-green-700">Confirmados</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{completedAppointments}</p>
                <p className="text-sm text-blue-700">Concluídos</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                <p className="text-sm text-yellow-700">Pendentes</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{cancelledAppointments}</p>
                <p className="text-sm text-red-700">Cancelados</p>
              </div>
            </div>
            
            {statusData.length > 0 && (
              <div className="space-y-2">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm">{status.name}</span>
                    </div>
                    <Badge variant="outline" style={{ color: status.color, borderColor: status.color }}>
                      {status.value}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700 text-lg text-center">Resumo da Clínica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700 font-medium">Total de Agendamentos</span>
                <span className="text-2xl font-bold text-blue-600">
                  {confirmedAppointments + completedAppointments + pendingAppointments + cancelledAppointments}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Taxa de Sucesso</span>
                <span className="text-2xl font-bold text-green-600">
                  {confirmedAppointments + completedAppointments + pendingAppointments + cancelledAppointments > 0 
                    ? Math.round(((confirmedAppointments + completedAppointments) / (confirmedAppointments + completedAppointments + pendingAppointments + cancelledAppointments)) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
