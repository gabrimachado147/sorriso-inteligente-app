
import React, { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDataProcessor } from '@/hooks/useDataProcessor';
import { OptimizedProps, DataItem } from '@/types/developer';
import { CheckCircle, TrendingUp, Zap } from 'lucide-react';

// Exemplo prático de implementação das otimizações sugeridas
export const OptimizedDataTable: React.FC<OptimizedProps> = memo(({ 
  data, 
  onUpdate, 
  loading = false 
}) => {
  const {
    filteredData,
    totalValue,
    activeCount,
    performBatchUpdate
  } = useDataProcessor([...data]);

  const handleBatchOptimization = useCallback(async () => {
    const updates = data.map(item => ({
      id: item.id,
      updates: { status: 'active' as const }
    }));
    
    await performBatchUpdate(updates);
  }, [data, performBatchUpdate]);

  const optimizationMetrics = {
    performance: Math.round((activeCount / data.length) * 100),
    efficiency: Math.min(100, Math.round((totalValue / data.length) * 10)),
    quality: 85
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Tabela de Dados Otimizada
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            React.memo + useMemo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas em tempo real */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
            <div className="text-sm text-blue-700">Itens Ativos</div>
            <Progress value={optimizationMetrics.performance} className="mt-2 h-2" />
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalValue}</div>
            <div className="text-sm text-green-700">Valor Total</div>
            <Progress value={optimizationMetrics.efficiency} className="mt-2 h-2" />
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{optimizationMetrics.quality}%</div>
            <div className="text-sm text-purple-700">Qualidade</div>
            <Progress value={optimizationMetrics.quality} className="mt-2 h-2" />
          </div>
        </div>

        {/* Lista otimizada */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredData.map((item: DataItem) => (
            <OptimizedDataRow 
              key={item.id} 
              item={item} 
              onUpdate={onUpdate}
            />
          ))}
        </div>

        {/* Controles de otimização */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Otimizações ativas: useMemo, useCallback, React.memo</span>
          </div>
          <Button 
            onClick={handleBatchOptimization}
            disabled={loading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <TrendingUp className="h-3 w-3 mr-2" />
            Otimizar Batch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Componente otimizado para linha individual
const OptimizedDataRow = memo<{
  item: DataItem;
  onUpdate: (id: string, updates: Partial<DataItem>) => void;
}>(({ item, onUpdate }) => {
  const handleStatusToggle = useCallback(() => {
    onUpdate(item.id, { 
      status: item.status === 'active' ? 'inactive' : 'active' 
    });
  }, [item.id, item.status, onUpdate]);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <span className="font-medium">{item.name}</span>
        <span className="ml-2 text-sm text-muted-foreground">Valor: {item.value}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
        <Button size="sm" variant="outline" onClick={handleStatusToggle}>
          Toggle
        </Button>
      </div>
    </div>
  );
});

OptimizedDataTable.displayName = 'OptimizedDataTable';
OptimizedDataRow.displayName = 'OptimizedDataRow';
