
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useXAI } from '@/hooks/useXAI';
import { Brain, Lightbulb, Code, AlertCircle, RefreshCw, Copy, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface XAIInsightPanelProps {
  onInsight?: (insight: string) => void;
}

export const XAIInsightPanel: React.FC<XAIInsightPanelProps> = ({ onInsight }) => {
  const [prompt, setPrompt] = useState('');
  const [insight, setInsight] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const { loading, configured, generateInsight, checkConfiguration, refreshConfiguration } = useXAI();

  React.useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]);

  const handleGenerateInsight = async () => {
    if (!prompt.trim()) return;

    const result = await generateInsight(prompt);
    if (result) {
      setInsight(result);
      onInsight?.(result);
    } else {
      setInsight('Erro ao gerar insight. Verifique a configuração da API.');
    }
  };

  const handleRefreshConfig = async () => {
    await refreshConfiguration();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickPrompts = [
    {
      title: 'Análise de Arquitetura',
      prompt: 'Analise a arquitetura completa do projeto Sorriso Inteligente, incluindo estrutura de componentes React, hooks personalizados, integração com Supabase e padrões de design utilizados. Forneça um código de exemplo completo para otimização de performance usando React.memo, useMemo e useCallback. Inclua também exemplos de políticas RLS no Supabase, configuração de real-time subscriptions e implementação de edge functions. Detalhe a estrutura de pastas, convenções de nomenclatura e melhores práticas para manutenção do código. Adicione exemplos completos de testes unitários com Jest e Testing Library.'
    },
    {
      title: 'Otimização de Performance',
      prompt: 'Sugira melhorias específicas de performance para esta aplicação React com TypeScript, incluindo lazy loading, code splitting, memoization, otimizações do Supabase e PWA. Forneça código completo para implementar: 1) Lazy loading de componentes com React.lazy e Suspense, 2) Implementação de service worker para cache offline, 3) Otimização de queries do Supabase com índices e filtros, 4) Implementação de virtual scrolling para listas grandes, 5) Configuração de webpack para bundle splitting, 6) Implementação de prefetching de dados críticos, 7) Otimização de imagens com loading lazy e formatos modernos.'
    },
    {
      title: 'Melhores Práticas TypeScript',
      prompt: 'Revise o uso de TypeScript no projeto e sugira melhorias nos tipos, interfaces e padrões de tipagem. Forneça exemplos completos de: 1) Tipos utilitários avançados (Pick, Omit, Partial, Record), 2) Generics para componentes reutilizáveis, 3) Discriminated unions para estados complexos, 4) Tipagem estrita para props de componentes, 5) Tipos para APIs do Supabase com geração automática, 6) Implementação de type guards e assertion functions, 7) Configuração avançada do tsconfig.json para strict mode, 8) Tipagem de custom hooks com retorno complexo.'
    },
    {
      title: 'Integração Supabase Avançada',
      prompt: 'Como posso otimizar o uso do Supabase neste projeto? Inclua exemplos completos de: 1) Queries otimizadas com joins e filtros complexos, 2) Políticas RLS avançadas para diferentes níveis de usuário, 3) Edge functions para processamento server-side, 4) Real-time subscriptions para atualizações instantâneas, 5) Storage para upload de arquivos com resize automático, 6) Triggers de banco para automação, 7) Backup e migração de dados, 8) Monitoring e logging avançado, 9) Implementação de full-text search, 10) Configuração de webhooks para integrações externas.'
    },
    {
      title: 'Segurança e Autenticação',
      prompt: 'Identifique possíveis problemas de segurança no código e no banco de dados. Forneça exemplos completos de: 1) Políticas RLS para proteger dados sensíveis, 2) Validação de entrada com Zod schemas, 3) Sanitização de dados para prevenir XSS, 4) Implementação de rate limiting, 5) Configuração de CORS adequada, 6) Criptografia de dados sensíveis, 7) Auditoria de ações de usuário, 8) Implementação de 2FA, 9) Gestão segura de tokens JWT, 10) Práticas de segurança para PWA incluindo CSP headers.'
    },
    {
      title: 'PWA e Performance Mobile',
      prompt: 'Como melhorar a experiência PWA e performance mobile? Inclua código completo para: 1) Service worker avançado com estratégias de cache personalizadas, 2) App manifest otimizado com ícones adaptativos, 3) Implementação de background sync, 4) Push notifications com Supabase, 5) Otimização para devices com pouca memória, 6) Implementação de offline-first architecture, 7) Lazy loading de imagens responsivas, 8) Otimização de bundle size para mobile, 9) Implementação de install prompt customizado, 10) Performance metrics e monitoring em tempo real.'
    },
    {
      title: 'Testes e Qualidade',
      prompt: 'Implemente uma estratégia completa de testes para o projeto. Forneça código completo para: 1) Testes unitários com Jest e Testing Library, 2) Testes de integração com Supabase usando test database, 3) Testes end-to-end com Playwright, 4) Testes de performance com Lighthouse CI, 5) Testes de acessibilidade automatizados, 6) Mock strategies para APIs externas, 7) Setup de CI/CD com GitHub Actions, 8) Code coverage e quality gates, 9) Visual regression testing, 10) Load testing para endpoints críticos.'
    },
    {
      title: 'Arquitetura e Escalabilidade',
      prompt: 'Projete uma arquitetura escalável para o Sorriso Inteligente. Inclua código completo para: 1) Implementação de micro-frontends com Module Federation, 2) State management avançado com Zustand ou Context API, 3) Padrão de design system com Storybook, 4) Implementação de feature flags, 5) Monorepo setup com Nx ou Lerna, 6) API versioning estratégias, 7) Database sharding e partitioning no Supabase, 8) CDN setup para assets estáticos, 9) Monitoring e alerting com Sentry, 10) Deployment strategies com blue-green deployment.'
    }
  ];

  if (!configured) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            XAI/Grok não configurado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-orange-700 text-sm">
            Configure a API key do Grok no Supabase para usar insights de IA durante o desenvolvimento.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-orange-600">
              <strong>Passos para configurar:</strong>
            </p>
            <ol className="text-xs text-orange-600 list-decimal list-inside space-y-1 pl-2">
              <li>Acesse as configurações do Supabase</li>
              <li>Vá para "Settings" → "Secrets"</li>
              <li>Adicione a secret "XAI_API_KEY" com sua chave do Grok</li>
              <li>Clique em "Verificar Configuração" abaixo</li>
            </ol>
          </div>
          <Button
            onClick={handleRefreshConfig}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Configuração
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Grok Development Insights
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Ativo
            </Badge>
            <Button
              onClick={handleRefreshConfig}
              variant="ghost"
              size="sm"
              className="ml-auto"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Prompt personalizado para o Grok:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite sua pergunta específica sobre o projeto..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <Button
            onClick={handleGenerateInsight}
            disabled={!prompt.trim() || loading}
            className="w-full"
          >
            {loading ? (
              'Gerando insight...'
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Gerar Insight Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Prompts Pré-configurados (Clique para ver completo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickPrompts.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setPrompt(item.prompt)}
                      className="flex-1 justify-start text-left h-auto p-0"
                    >
                      <div className="w-full">
                        <div className="font-medium text-sm text-purple-700">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Clique para usar este prompt completo
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedPrompt(expandedPrompt === index ? null : index)}
                      className="ml-2"
                    >
                      {expandedPrompt === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {expandedPrompt === index && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-600">Prompt Completo:</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.prompt)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadAsFile(item.prompt, `prompt-${item.title.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                            className="h-6 w-6 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono bg-white p-2 rounded border max-h-none overflow-visible">
                        {item.prompt}
                      </div>
                    </div>
                  )}
                </div>
                {index < quickPrompts.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {insight && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-800 flex items-center justify-between">
              <span>Insight Completo do Grok:</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(insight)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadAsFile(insight, 'grok-insight.md')}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-purple-900 whitespace-pre-wrap break-words font-mono overflow-visible max-h-none">
                {insight}
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded text-xs text-purple-700">
              <strong>💡 Dica:</strong> Use os botões acima para copiar ou baixar o código completo. 
              O Grok fornece exemplos completos de implementação que você pode usar diretamente no projeto.
              Todo o conteúdo é exibido sem limitações de altura.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
