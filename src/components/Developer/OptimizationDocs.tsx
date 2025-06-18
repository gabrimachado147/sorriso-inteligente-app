
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Code, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle,
  Target
} from 'lucide-react';

export const OptimizationDocs: React.FC = () => {
  const optimizationExamples = {
    useMemo: `// ✅ Boa prática - Memoização de cálculos custosos
const expensiveCalculation = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// ❌ Evitar - Recalculo desnecessário a cada render
const total = data.reduce((acc, item) => acc + item.value, 0);`,

    useCallback: `// ✅ Boa prática - Memoização de funções
const handleUpdate = useCallback((id: string, updates: Partial<DataItem>) => {
  setData(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
}, []);

// ❌ Evitar - Nova função a cada render
const handleUpdate = (id: string, updates: Partial<DataItem>) => {
  setData(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};`,

    reactMemo: `// ✅ Boa prática - Evitar re-renders desnecessários
const OptimizedComponent = React.memo(({ data, onUpdate }: Props) => {
  return (
    <div>
      {data.map(item => (
        <ItemComponent key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});

// ✅ Comparação customizada se necessário
const OptimizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.data.length === nextProps.data.length;
});`,

    typescript: `// ✅ Boa prática - Tipagem rigorosa
interface OptimizedProps {
  data: ReadonlyArray<DataItem>;
  onUpdate: (id: string, updates: Partial<DataItem>) => void;
  loading?: boolean;
}

// ✅ Union types para estados bem definidos
type Status = 'active' | 'inactive' | 'pending';

// ✅ Generics para reutilização
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}`
  };

  const bestPractices = [
    {
      category: 'Performance',
      icon: Target,
      practices: [
        'Use useMemo para cálculos custosos',
        'Implemente useCallback para funções em props',
        'Aplique React.memo em componentes de lista',
        'Evite objetos/arrays inline em props',
        'Use React.lazy para code splitting'
      ]
    },
    {
      category: 'TypeScript',
      icon: Code,
      practices: [
        'Defina interfaces rigorosas',
        'Use ReadonlyArray para dados imutáveis',
        'Implemente union types para estados',
        'Evite any, prefira unknown',
        'Use generics para reutilização'
      ]
    },
    {
      category: 'Arquitetura',
      icon: Lightbulb,
      practices: [
        'Separe lógica em hooks customizados',
        'Mantenha componentes pequenos e focados',
        'Implemente error boundaries',
        'Use Context para estado global',
        'Organize por features, não por tipo'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Documentação de Otimizações</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Guia Completo
        </Badge>
      </div>

      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="examples">Exemplos de Código</TabsTrigger>
          <TabsTrigger value="practices">Melhores Práticas</TabsTrigger>
        </TabsList>

        <TabsContent value="examples" className="space-y-4">
          <Tabs defaultValue="useMemo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="useMemo">useMemo</TabsTrigger>
              <TabsTrigger value="useCallback">useCallback</TabsTrigger>
              <TabsTrigger value="reactMemo">React.memo</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            </TabsList>

            {Object.entries(optimizationExamples).map(([key, code]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{key}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestPractices.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5 text-purple-600" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.practices.map((practice, practiceIndex) => (
                        <div key={practiceIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{practice}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Armadilhas Comuns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Evite usar useMemo/useCallback desnecessariamente - pode ser pior que o problema original</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Não otimize prematuramente - meça primeiro, otimize depois</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>React.memo com props complexas pode não funcionar como esperado</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Dependências incorretas em hooks podem causar bugs sutis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
