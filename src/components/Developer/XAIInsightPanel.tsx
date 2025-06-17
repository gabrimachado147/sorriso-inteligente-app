
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useXAI } from '@/hooks/useXAI';
import { Brain, Lightbulb, Code, AlertCircle } from 'lucide-react';

interface XAIInsightPanelProps {
  onInsight?: (insight: string) => void;
}

export const XAIInsightPanel: React.FC<XAIInsightPanelProps> = ({ onInsight }) => {
  const [prompt, setPrompt] = useState('');
  const [insight, setInsight] = useState('');
  const { loading, configured, generateInsight, checkConfiguration } = useXAI();

  React.useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]);

  const handleGenerateInsight = async () => {
    if (!prompt.trim()) return;

    const result = await generateInsight(prompt);
    if (result) {
      setInsight(result);
      onInsight?.(result);
    }
  };

  const quickPrompts = [
    'Analise a arquitetura atual do projeto Sorriso Inteligente',
    'Sugira melhorias de performance para esta aplicação React',
    'Como posso otimizar o uso do Supabase neste projeto?',
    'Identifique possíveis problemas de segurança no código',
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
        <CardContent>
          <p className="text-orange-700 text-sm">
            Configure a API key do Grok no Supabase para usar insights de IA durante o desenvolvimento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Grok Development Insights
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Ativo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Prompt para o Grok:
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite sua pergunta sobre o projeto..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(quickPrompt)}
              className="text-xs"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              {quickPrompt.substring(0, 30)}...
            </Button>
          ))}
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
              Gerar Insight
            </>
          )}
        </Button>

        {insight && (
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-800">
                Insight do Grok:
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-purple-900 whitespace-pre-wrap">
                {insight}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
