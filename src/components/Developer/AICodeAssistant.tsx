
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Code, 
  FileCode, 
  Lightbulb, 
  Zap, 
  RefreshCw,
  Copy,
  Download,
  Sparkles,
  GitCommit,
  TestTube
} from 'lucide-react';

export const AICodeAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('grok-beta');

  const aiModels = [
    { id: 'grok-beta', name: 'Grok Beta', description: 'Modelo mais avançado para análise de código' },
    { id: 'claude-3', name: 'Claude 3', description: 'Excelente para refatoração e otimização' },
    { id: 'gpt-4', name: 'GPT-4', description: 'Ótimo para documentação e testes' }
  ];

  const quickActions = [
    {
      title: 'Refatorar Componente',
      description: 'Otimizar estrutura e performance',
      prompt: 'Analise este componente React e sugira melhorias de performance, legibilidade e manutenibilidade. Considere: 1) Uso de React.memo 2) Otimização de re-renders 3) Extração de lógica para hooks customizados 4) Tipagem TypeScript mais rigorosa 5) Acessibilidade',
      icon: Code
    },
    {
      title: 'Gerar Testes',
      description: 'Criar testes unitários e de integração',
      prompt: 'Gere testes abrangentes para este código usando Jest e React Testing Library. Inclua: 1) Testes unitários para todas as funções 2) Testes de componente com diferentes props 3) Testes de integração para fluxos completos 4) Mocks apropriados 5) Casos edge e tratamento de erros',
      icon: TestTube
    },
    {
      title: 'Documentar API',
      description: 'Criar documentação técnica completa',
      prompt: 'Crie documentação técnica completa para esta API/serviço incluindo: 1) Descrição da funcionalidade 2) Parâmetros de entrada e saída 3) Exemplos de uso 4) Tratamento de erros 5) Considerações de performance 6) JSDoc detalhado',
      icon: FileCode
    },
    {
      title: 'Otimizar Performance',
      description: 'Identificar gargalos e melhorias',
      prompt: 'Analise este código para otimizações de performance. Identifique: 1) Operações custosas que podem ser otimizadas 2) Vazamentos de memória potenciais 3) Re-renders desnecessários 4) Oportunidades de lazy loading 5) Melhorias no bundle size 6) Otimizações de rede',
      icon: Zap
    },
    {
      title: 'Code Review',
      description: 'Revisão completa de qualidade',
      prompt: 'Faça uma revisão completa deste código considerando: 1) Qualidade e legibilidade 2) Convenções de nomenclatura 3) Arquitetura e padrões 4) Segurança 5) Tratamento de erros 6) Escalabilidade 7) Manutenibilidade',
      icon: GitCommit
    },
    {
      title: 'Sugestões de Arquitetura',
      description: 'Melhorar estrutura do projeto',
      prompt: 'Analise a arquitetura atual e sugira melhorias para: 1) Organização de pastas e arquivos 2) Separação de responsabilidades 3) Reutilização de código 4) Escalabilidade 5) Padrões de design apropriados 6) Estrutura de dados otimizada',
      icon: Lightbulb
    }
  ];

  const generateResponse = async (inputPrompt: string) => {
    setLoading(true);
    try {
      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponse = `# Análise de Código - ${activeModel.toUpperCase()}

## 🔍 Análise Inicial
Com base no prompt fornecido, identifiquei várias oportunidades de melhoria:

## 📊 Métricas de Qualidade
- **Complexidade Ciclomática**: Moderada (Score: 7/10)
- **Manutenibilidade**: Boa (Score: 8/10)
- **Testabilidade**: Excelente (Score: 9/10)

## 🚀 Sugestões de Implementação

### 1. Otimização de Performance
\`\`\`typescript
// Exemplo de otimização com useMemo
const expensiveCalculation = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);
\`\`\`

### 2. Melhoria de Tipagem
\`\`\`typescript
interface OptimizedProps {
  data: ReadonlyArray<DataItem>;
  onUpdate: (id: string, updates: Partial<DataItem>) => void;
  loading?: boolean;
}
\`\`\`

### 3. Hook Customizado Sugerido
\`\`\`typescript
const useDataProcessor = (initialData: DataItem[]) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  
  const updateItem = useCallback((id: string, updates: Partial<DataItem>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  return { data, loading, updateItem };
};
\`\`\`

## ✅ Próximos Passos
1. Implementar as otimizações sugeridas
2. Adicionar testes unitários
3. Atualizar documentação
4. Monitorar performance em produção

## 📝 Observações Adicionais
- Considere usar React.memo para componentes que renderizam listas grandes
- Implemente error boundaries para melhor UX
- Use React Query para gerenciamento de estado do servidor`;

      setResponse(mockResponse);
    } catch (error) {
      setResponse('Erro ao gerar resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          Assistente de IA para Código
        </h2>
        <div className="flex items-center gap-2">
          <select 
            value={activeModel} 
            onChange={(e) => setActiveModel(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {aiModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Sparkles className="h-3 w-3 mr-1" />
            IA Ativa
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assistant">Assistente</TabsTrigger>
          <TabsTrigger value="quick-actions">Ações Rápidas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat com IA Especializada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descreva o que você precisa ou cole seu código:
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Preciso otimizar este componente React que está causando re-renders desnecessários..."
                  className="min-h-[150px]"
                />
              </div>

              <Button
                onClick={() => generateResponse(prompt)}
                disabled={!prompt.trim() || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processando com {aiModels.find(m => m.id === activeModel)?.name}...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Análise e Sugestões
                  </>
                )}
              </Button>

              {response && (
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Resposta da IA:</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(response)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([response], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'ai-analysis.md';
                            a.click();
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded border">
                      <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
                    <Button
                      onClick={() => {
                        setPrompt(action.prompt);
                        generateResponse(action.prompt);
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Executar Ação
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Templates de Componentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileCode className="h-3 w-3 mr-2" />
                  Hook Customizado
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileCode className="h-3 w-3 mr-2" />
                  Componente com Context
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileCode className="h-3 w-3 mr-2" />
                  Serviço API
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Templates de Testes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TestTube className="h-3 w-3 mr-2" />
                  Teste de Componente
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TestTube className="h-3 w-3 mr-2" />
                  Teste de Hook
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TestTube className="h-3 w-3 mr-2" />
                  Teste de Integração
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
