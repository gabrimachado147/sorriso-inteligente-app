
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  appointments: any[];
  stats: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, stats }) => {
  // Dados simulados para os gráficos
  const monthlyData = [
    { month: 'Jan', agendamentos: 45, conversoes: 38 },
    { month: 'Fev', agendamentos: 52, conversoes: 44 },
    { month: 'Mar', agendamentos: 48, conversoes: 41 },
    { month: 'Abr', agendamentos: 58, conversoes: 52 },
    { month: 'Mai', agendamentos: 65, conversoes: 58 },
    { month: 'Jun', agendamentos: 72, conversoes: 65 }
  ];

  const servicesData = [
    { name: 'Limpeza', value: 35, color: '#3b82f6' },
    { name: 'Avaliação', value: 25, color: '#10b981' },
    { name: 'Ortodontia', value: 20, color: '#f59e0b' },
    { name: 'Implante', value: 15, color: '#ef4444' },
    { name: 'Outros', value: 5, color: '#8b5cf6' }
  ];

  const clinicsData = [
    { clinic: 'Campo Belo', agendamentos: 25, taxa: 85 },
    { clinic: 'Formiga', agendamentos: 22, taxa: 78 },
    { clinic: 'Itararé', agendamentos: 18, taxa: 82 },
    { clinic: 'Capão Bonito', agendamentos: 15, taxa: 79 },
    { clinic: 'Itapeva', agendamentos: 12, taxa: 76 }
  ];

  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn}`}>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Dashboard Administrativo 👩‍⚕️
        </h1>
        <p className="text-gray-600">Visão completa dos agendamentos e performance</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${animations.slideInLeft}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agendamentos</p>
                <p className="text-3xl font-bold text-primary">{appointments?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% este mês</p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-3xl font-bold text-green-600">85%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+3% este mês</p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                <p className="text-3xl font-bold text-purple-600">342</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+8% este mês</p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-3xl font-bold text-orange-600">45min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-red-600 mt-2">-2min este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Organizadas */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clinics">Clínicas</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="agendamentos" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agendamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments?.slice(0, 5).map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{apt.name || 'Paciente'}</p>
                          <p className="text-sm text-gray-600">{apt.service || 'Consulta'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.date}</p>
                        <p className="text-xs text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 py-8">Nenhum agendamento encontrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversão vs Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="agendamentos" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversoes" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Confirmados</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">68%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span>Pendentes</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">22%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span>Cancelados</span>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">7%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <span>Não Compareceu</span>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={clinicsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="clinic" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="agendamentos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
