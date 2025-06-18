
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDataProcessor } from '@/hooks/useDataProcessor';
import { DataItem } from '@/types/developer';
import { 
  Database, 
  TrendingUp, 
  Users, 
  Activity,
  Plus,
  RefreshCw
} from 'lucide-react';

interface OptimizedDataProcessorProps {
  initialData: DataItem[];
  title?: string;
}

// Memoized component to prevent unnecessary re-renders
export const OptimizedDataProcessor = memo<OptimizedDataProcessorProps>(({ 
  initialData, 
  title = "Processador de Dados Otimizado" 
}) => {
  const { 
    data, 
    loading, 
    updateItem, 
    removeItem, 
    addItem, 
    statistics, 
    expensiveCalculation,
    setLoadingState 
  } = useDataProcessor(initialData);

  const handleRandomUpdate = () => {
    if (data.length > 0) {
      const randomItem = data[Math.floor(Math.random() * data.length)];
      updateItem(randomItem.id, { 
        value: Math.floor(Math.random() * 100) + 1 
      });
    }
  };

  const handleAddRandomItem = () => {
    const newItem: DataItem = {
      id: `item_${Date.now()}`,
      name: `Item ${data.length + 1}`,
      value: Math.floor(Math.random() * 100) + 1,
      status: Math.random() > 0.5 ? 'active' : 'inactive'
    };
    addItem(newItem);
  };

  const simulateLoading = () => {
    setLoadingState(true);
    setTimeout(() => setLoadingState(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-blue-600" />
          {title}
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            OTIMIZADO
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{statistics.total}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Ativos</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{statistics.active}</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Média</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {statistics.averageValue.toFixed(1)}
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Valor</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{expensiveCalculation}</div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Itens Ativos</span>
              <span>{statistics.active}/{statistics.total}</span>
            </div>
            <Progress 
              value={statistics.total > 0 ? (statistics.active / statistics.total) * 100 : 0} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Performance Geral</span>
              <span>{statistics.averageValue.toFixed(0)}%</span>
            </div>
            <Progress value={statistics.averageValue} className="h-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleRandomUpdate} 
            size="sm" 
            variant="outline"
            disabled={loading || data.length === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Aleatório
          </Button>
          
          <Button 
            onClick={handleAddRandomItem} 
            size="sm" 
            variant="outline"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
          
          <Button 
            onClick={simulateLoading} 
            size="sm" 
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Simular Loading'
            )}
          </Button>
        </div>

        {/* Data List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {data.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{item.name}</span>
                <Badge 
                  variant={item.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.value}</span>
                <Button
                  onClick={() => removeItem(item.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum item para processar</p>
            <Button onClick={handleAddRandomItem} size="sm" className="mt-2">
              Adicionar Primeiro Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedDataProcessor.displayName = 'OptimizedDataProcessor';
