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
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-blue-700 text-lg font-semibold text-center">Performance por Clínica</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {clinicStats.length > 0 ? (
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={clinicStats.slice(0, 6)} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={false}
                    axisLine={false}
                    height={20}
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="#666"
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'appointments' ? 'Agendamentos' : 'Confirmados'
                    ]}
                    labelFormatter={(label) => `Clínica: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="appointments" 
                    fill="#3b82f6" 
                    name="Agendamentos" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="confirmed" 
                    fill="#10b981" 
                    name="Confirmados" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm">Sem dados de clínicas</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-200 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-green-700 text-lg font-semibold text-center">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {monthlyTrend.length > 0 ? (
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={monthlyTrend}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                    stroke="#666"
                    tickMargin={8}
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="#666"
                    tickMargin={8}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      name === 'agendamentos' ? 'Agendamentos' : 'Conversões'
                    ]}
                    labelFormatter={(label) => `Mês: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="agendamentos" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversoes" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-sm">Sem dados mensais</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700 text-lg text-center">Distribuição de Serviços</CardTitle>
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
          <CardTitle className="text-indigo-700 text-lg text-center">Status dos Agendamentos</CardTitle>
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
          <CardTitle className="text-gray-700 text-lg text-center">Ranking de Clínicas</CardTitle>
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
