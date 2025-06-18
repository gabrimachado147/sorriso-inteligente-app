
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { animations } from '@/lib/animations';

interface KPIItem {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number;
  unit?: string;
  format?: 'currency' | 'percentage' | 'number';
  icon: React.ComponentType<any>;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

interface DynamicKPIsProps {
  kpis: KPIItem[];
  isLoading?: boolean;
}

export const DynamicKPIs: React.FC<DynamicKPIsProps> = ({ kpis, isLoading = false }) => {
  const formatValue = (value: number | string, format?: 'currency' | 'percentage' | 'number', unit?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return unit ? `${value.toLocaleString('pt-BR')} ${unit}` : value.toLocaleString('pt-BR');
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const calculateTrendPercentage = (current: number | string, previous?: number) => {
    if (typeof current === 'string' || !previous) return null;
    const change = ((current - previous) / previous) * 100;
    return Math.abs(change).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ${animations.fadeIn}`}>
      {kpis.map((kpi) => {
        const IconComponent = kpi.icon;
        const TrendIcon = getTrendIcon(kpi.trend);
        const trendPercentage = typeof kpi.value === 'number' ? calculateTrendPercentage(kpi.value, kpi.previousValue) : null;

        return (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 truncate">
                {kpi.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${kpi.color}`}>
                    {formatValue(kpi.value, kpi.format, kpi.unit)}
                  </div>
                  {kpi.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {kpi.description}
                    </p>
                  )}
                </div>
                {kpi.trend && trendPercentage && (
                  <div className={`flex items-center gap-1 ${getTrendColor(kpi.trend)}`}>
                    <TrendIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {trendPercentage}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
