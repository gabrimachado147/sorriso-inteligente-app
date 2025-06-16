
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsChartsProps {
  stats: any;
  statsLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats, statsLoading }) => {
  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Carregando gráficos...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar dados para gráfico de barras por clínica
  const clinicsData = stats?.byClinic ? Object.entries(stats.byClinic).map(([name, value]) => ({
    name: name.replace('Senhor Sorriso ', ''),
    agendamentos: Number(value)
  })) : [];

  // Dados para gráfico de pizza de status
  const statusData = [
    { name: 'Confirmados', value: stats?.confirmed || 0, color: '#10B981' },
    { name: 'Concluídos', value: stats?.completed || 0, color: '#3B82F6' },
    { name: 'Cancelados', value: stats?.cancelled || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Dados simulados para tendência semanal (você pode implementar dados reais)
  const weeklyData = [
    { dia: 'Seg', agendamentos: stats?.total ? Math.floor(stats.total * 0.15) : 5 },
    { dia: 'Ter', agendamentos: stats?.total ? Math.floor(stats.total * 0.18) : 7 },
    { dia: 'Qua', agendamentos: stats?.total ? Math.floor(stats.total * 0.12) : 4 },
    { dia: 'Qui', agendamentos: stats?.total ? Math.floor(stats.total * 0.20) : 8 },
    { dia: 'Sex', agendamentos: stats?.total ? Math.floor(stats.total * 0.25) : 10 },
    { dia: 'Sáb', agendamentos: stats?.total ? Math.floor(stats.total * 0.08) : 3 },
    { dia: 'Dom', agendamentos: stats?.total ? Math.floor(stats.total * 0.02) : 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Gráfico de barras por clínica */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Agendamentos por Clínica</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clinicsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="agendamentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pizza para status */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Status dos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de linha para tendência semanal */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Tendência Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="agendamentos" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de conversão */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Métricas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats?.total ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-green-700">Taxa de Confirmação</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-700">Taxa de Conclusão</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats?.today || 0}
              </div>
              <div className="text-sm text-purple-700">Agendamentos Hoje</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
