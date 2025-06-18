
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, RefreshCw } from 'lucide-react';

interface XAIPromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerateInsight: () => void;
  onRefreshConfig: () => void;
  loading: boolean;
}

export const XAIPromptInput: React.FC<XAIPromptInputProps> = ({
  prompt,
  onPromptChange,
  onGenerateInsight,
  onRefreshConfig,
  loading
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !loading && prompt.trim()) {
      e.preventDefault();
      onGenerateInsight();
    }
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Grok Development Insights
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Ativo
          </Badge>
          <Button
            onClick={onRefreshConfig}
            variant="ghost"
            size="sm"
            className="ml-auto"
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
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
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta específica sobre o projeto... (Ctrl+Enter para enviar)"
            className="min-h-[120px] resize-none"
            disabled={loading}
          />
        </div>

        <Button
          onClick={onGenerateInsight}
          disabled={!prompt.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Gerando insight...
            </>
          ) : (
            <>
              <Code className="h-4 w-4 mr-2" />
              Gerar Insight Completo
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Dica: Use Ctrl+Enter para enviar rapidamente
        </div>
      </CardContent>
    </Card>
  );
};
