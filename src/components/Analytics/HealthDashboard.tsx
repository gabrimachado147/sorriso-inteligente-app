
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHealthAnalytics } from '@/hooks/useHealthAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Calendar, Download } from 'lucide-react';

export const HealthDashboard: React.FC = () => {
  const { metrics, trends, insights, loading, getHealthScore, getRecommendations } = useHealthAnalytics();

  const healthScore = getHealthScore();
  const recommendations = getRecommendations();

  const appointmentTypes = [
    { name: 'Limpeza', value: metrics.filter(m => m.type === 'cleaning').length, color: '#8884d8' },
    { name: 'Tratamento', value: metrics.filter(m => m.type === 'treatment').length, color: '#82ca9d' },
    { name: 'Consulta', value: metrics.filter(m => m.type === 'checkup').length, color: '#ffc658' },
    { name: 'Outros', value: metrics.filter(m => m.type === 'appointment').length, color: '#ff7300' }
  ];

  const exportHealthReport = () => {
    const report = {
      periodo: `${trends[0]?.period} - ${trends[trends.length - 1]?.period}`,
      pontuacaoSaude: healthScore,
      totalConsultas: metrics.length,
      cuidadosPreventivos: metrics.filter(m => m.type === 'cleaning').length,
      avaliacaoMedia: (metrics.reduce((sum, m) => sum + (m.rating || 0), 0) / metrics.length).toFixed(1),
      recomendacoes: recommendations.map(r => r.message)
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-saude-bucal.json';
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Carregando dados de saúde...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score de Saúde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pontuação de Saúde Bucal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-primary mb-2">{healthScore}/100</div>
              <Progress value={healthScore} className="h-3" />
              <div className="text-sm text-muted-foreground mt-2">
                {healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Bom' : 'Precisa melhorar'}
              </div>
            </div>
            <div className="text-right">
              <Button onClick={exportHealthReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.slice(0, 4).map((insight) => (
          <Card key={insight.id} className={
            insight.type === 'warning' ? 'border-orange-200 bg-orange-50' :
            insight.type === 'congratulation' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />}
                {insight.type === 'congratulation' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                {insight.type === 'recommendation' && <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {insight.message}
                  </div>
                  {insight.actionRequired && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      Ação Necessária
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Tendências */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução dos Cuidados</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#8884d8" name="Consultas" />
              <Bar dataKey="preventiveCare" fill="#82ca9d" name="Cuidados Preventivos" />
              <Bar dataKey="treatments" fill="#ffc658" name="Tratamentos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição de Consultas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {appointmentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {appointmentTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm">{type.name}: {type.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageRating"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Avaliação Média"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {trends.length > 0 ? trends[trends.length - 1].averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de Consultas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="font-medium">{metric.service}</div>
                  <div className="text-sm text-muted-foreground">
                    {metric.date.toLocaleDateString('pt-BR')}
                  </div>
                  {metric.notes && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {metric.notes}
                    </div>
                  )}
                </div>
                {metric.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < metric.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
