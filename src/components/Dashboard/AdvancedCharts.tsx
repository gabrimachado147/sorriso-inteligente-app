
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { animations } from '@/lib/animations';

interface ChartData {
  name: string;
  [key: string]: any;
}

interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'area' | 'bar' | 'pie';
  data: ChartData[];
  dataKeys: string[];
  colors: string[];
  description?: string;
}

interface AdvancedChartsProps {
  charts: ChartConfig[];
  isLoading?: boolean;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ charts, isLoading = false }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState(charts[0]?.id || '');

  const activeChart = charts.find(chart => chart.id === selectedChart) || charts[0];

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return Activity;
      case 'area': return TrendingUp;
      case 'bar': return BarChart3;
      case 'pie': return PieChartIcon;
      default: return BarChart3;
    }
  };

  const renderChart = (chart: ChartConfig) => {
    const commonProps = {
      width: '100%',
      height: 300,
      data: chart.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chart.dataKeys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={chart.colors[index]} 
                  strokeWidth={2}
                  dot={{ fill: chart.colors[index], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chart.dataKeys.map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stackId="1"
                  stroke={chart.colors[index]} 
                  fill={chart.colors[index]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chart.dataKeys.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={chart.colors[index]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={chart.dataKeys[0]}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chart.colors[index % chart.colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Análise Avançada</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecionar gráfico" />
                </SelectTrigger>
                <SelectContent>
                  {charts.map((chart) => {
                    const IconComponent = getChartIcon(chart.type);
                    return (
                      <SelectItem key={chart.id} value={chart.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {chart.title}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                  <SelectItem value="1y">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Chart */}
      {activeChart && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(getChartIcon(activeChart.type), { className: "h-5 w-5 text-primary" })}
              <div>
                <CardTitle>{activeChart.title}</CardTitle>
                {activeChart.description && (
                  <p className="text-sm text-gray-600 mt-1">{activeChart.description}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderChart(activeChart)}
          </CardContent>
        </Card>
      )}

      {/* Chart Grid for Multiple Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.slice(1, 5).map((chart) => {
          const IconComponent = getChartIcon(chart.type);
          return (
            <Card key={chart.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">{chart.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px' }}>
                  {renderChart({ ...chart, data: chart.data.slice(0, 5) })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
