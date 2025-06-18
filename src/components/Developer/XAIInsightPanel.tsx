
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useXAI } from '@/hooks/useXAI';
import { Brain, Lightbulb, Code, AlertCircle, RefreshCw, Copy, Download } from 'lucide-react';

interface XAIInsightPanelProps {
  onInsight?: (insight: string) => void;
}

export const XAIInsightPanel: React.FC<XAIInsightPanelProps> = ({ onInsight }) => {
  const [prompt, setPrompt] = useState('');
  const [insight, setInsight] = useState('');
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
      prompt: 'Analise a arquitetura completa do projeto Sorriso Inteligente, incluindo estrutura de componentes React, hooks personalizados, integração com Supabase e padrões de design utilizados. Forneça um código de exemplo completo.'
    },
    {
      title: 'Otimização de Performance',
      prompt: 'Sugira melhorias específicas de performance para esta aplicação React com TypeScript, incluindo lazy loading, memoization e otimizações do Supabase. Inclua exemplos de código completos para implementação.'
    },
    {
      title: 'Melhores Práticas TypeScript',
      prompt: 'Revise o uso de TypeScript no projeto e sugira melhorias nos tipos, interfaces e padrões de tipagem. Forneça exemplos completos de código TypeScript otimizado.'
    },
    {
      title: 'Integração Supabase',
      prompt: 'Como posso otimizar o uso do Supabase neste projeto? Inclua exemplos completos de queries otimizadas, políticas RLS e edge functions.'
    },
    {
      title: 'Segurança e RLS',
      prompt: 'Identifique possíveis problemas de segurança no código e no banco de dados. Forneça exemplos completos de políticas RLS e práticas de segurança.'
    },
    {
      title: 'PWA e Performance',
      prompt: 'Como melhorar a experiência PWA e performance mobile? Inclua código completo para service workers, cache strategies e otimizações mobile.'
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
              className="min-h-[100px]"
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
            Prompts Pré-configurados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {quickPrompts.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(item.prompt)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-xs">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.prompt.substring(0, 100)}...
                      </div>
                    </div>
                  </Button>
                  {index < quickPrompts.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
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
            <ScrollArea className="h-96">
              <div className="text-sm text-purple-900 whitespace-pre-wrap font-mono bg-white p-4 rounded border">
                {insight}
              </div>
            </ScrollArea>
            <div className="mt-4 p-3 bg-purple-100 rounded text-xs text-purple-700">
              <strong>💡 Dica:</strong> Use os botões acima para copiar ou baixar o código completo. 
              O Grok fornece exemplos completos de implementação que você pode usar diretamente no projeto.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
