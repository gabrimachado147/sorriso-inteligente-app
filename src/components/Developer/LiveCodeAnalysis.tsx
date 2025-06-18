
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useCodeAnalysis } from '@/hooks/useCodeAnalysis';
import { OptimizedDataProcessor } from './OptimizedDataProcessor';
import { DataItem } from '@/types/developer';
import { 
  Brain, 
  Code, 
  TrendingUp, 
  Shield, 
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const LiveCodeAnalysis: React.FC = () => {
  const { analysisResult, metrics, loading, runCodeAnalysis, generateOptimizedCode } = useCodeAnalysis();
  const [codeInput, setCodeInput] = React.useState('');

  // Dados de exemplo otimizados para demonstração
  const sampleData: DataItem[] = [
    { id: '1', name: 'Component A', value: 85, status: 'active' },
    { id: '2', name: 'Component B', value: 92, status: 'active' },
    { id: '3', name: 'Component C', value: 78, status: 'inactive' },
    { id: '4', name: 'Hook Custom', value: 95, status: 'active' },
    { id: '5', name: 'Service API', value: 88, status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              Complexidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7/10</div>
            <Progress value={70} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">Moderada</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-600" />
              Manutenibilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <Progress value={80} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">Boa</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Testabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9/10</div>
            <Progress value={90} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">Excelente</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">Muito bom</div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de código ao vivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Análise de Código ao Vivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Cole seu código aqui para análise em tempo real..."
            className="min-h-[120px] font-mono text-sm"
          />
          <Button 
            onClick={() => runCodeAnalysis(codeInput)}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Executar Análise Completa
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Componente otimizado implementado */}
      <OptimizedDataProcessor 
        initialData={sampleData} 
        title="Processador de Dados com Otimizações"
      />

      {/* Sugestões de implementação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Otimizações Implementadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>useMemo para cálculos custosos ✓</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>useCallback para funções otimizadas ✓</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>React.memo para evitar re-renders ✓</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Tipagem TypeScript rigorosa ✓</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Hook customizado useDataProcessor ✓</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">TODO</Badge>
              <span>Implementar error boundaries</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">TODO</Badge>
              <span>Adicionar testes unitários</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">TODO</Badge>
              <span>Documentar APIs</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">TODO</Badge>
              <span>Monitorar performance em produção</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Código exemplo gerado */}
      {analysisResult && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Código Otimizado Implementado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">Hook Customizado - useDataProcessor:</h4>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                  <code>{generateOptimizedCode('useCallback')}</code>
                </pre>
              </div>
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">Otimização com useMemo:</h4>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                  <code>{generateOptimizedCode('useMemo')}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
