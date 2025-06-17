
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface ClinicStat {
  name: string;
  appointments: number;
  confirmed: number;
  revenue: number;
  conversionRate: number;
}

interface MasterDashboardChartsProps {
  clinicStats: ClinicStat[];
  monthlyTrend: Array<{ month: string; agendamentos: number; conversoes: number; receita: number }>;
  serviceDistribution: Array<{ name: string; value: number; color: string }>;
  statusBreakdown: Array<{ name: string; value: number; color: string }>;
}

export const MasterDashboardCharts: React.FC<MasterDashboardChartsProps> = ({
  clinicStats,
  monthlyTrend,
  serviceDistribution,
  statusBreakdown
}) => {
  // Função para renderizar labels personalizados no gráfico de pizza
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Não mostrar labels para fatias muito pequenas

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
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Performance por Clínica</CardTitle>
        </CardHeader>
        <CardContent>
          {clinicStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clinicStats.slice(0, 6)} margin={{ bottom: 80, left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  fontSize={11}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === 'appointments' ? 'Agendamentos' : 'Confirmados'
                  ]}
                  labelFormatter={(label) => `Clínica: ${label}`}
                />
                <Bar dataKey="appointments" fill="#3b82f6" name="Agendamentos" />
                <Bar dataKey="confirmed" fill="#10b981" name="Confirmados" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados de clínicas
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'agendamentos' ? 'Agendamentos' : 'Conversões'
                  ]}
                />
                <Area type="monotone" dataKey="agendamentos" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="conversoes" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados mensais
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700">Distribuição de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {serviceDistribution.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Agendamentos']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legenda personalizada */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {serviceDistribution.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="truncate" title={service.name}>
                      {service.name} ({service.value})
                    </span>
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
          <CardTitle className="text-indigo-700">Status dos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {statusBreakdown.length > 0 ? (
            <div className="space-y-4">
              {statusBreakdown.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.name}</span>
                  </div>
                  <Badge variant="outline" style={{ color: status.color, borderColor: status.color }}>
                    {status.value}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Sem dados de status
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">Ranking de Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clinicStats.slice(0, 10).map((clinic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{clinic.name}</p>
                    <p className="text-sm text-gray-600">
                      {clinic.appointments} agendamentos • {clinic.conversionRate}% conversão
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {clinic.revenue > 0 
                      ? `R$ ${clinic.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'Sem receita'
                    }
                  </p>
                  <p className="text-sm text-gray-600">{clinic.confirmed} confirmados</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
