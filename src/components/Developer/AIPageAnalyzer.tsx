
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Sparkles, 
  Copy, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AnalysisResult {
  analysis: string;
  route: string;
  timestamp: string;
}

export const AIPageAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const route = window.location.pathname;
      const content = document.body.innerText || document.documentElement.innerText || '';
      
      if (!content.trim()) {
        throw new Error('Não foi possível capturar o conteúdo da página');
      }

      console.log('🧠 Iniciando análise com IA Estratégica...');

      const { data, error: functionError } = await supabase.functions.invoke('ai-page-analyzer', {
        body: {
          route,
          content: content.substring(0, 8000), // Limitar tamanho para evitar problemas
          userContext: userContext.trim() || undefined,
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Erro na comunicação com a IA');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      console.log('✅ Análise concluída com sucesso');

    } catch (err: any) {
      console.error('❌ Erro na análise:', err);
      setError(err.message || 'Erro desconhecido ao processar análise');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAnalysis = (analysis: string, route: string) => {
    const blob = new Blob([analysis], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-ai-${route.replace(/\//g, '-') || 'pagina'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Análise Estratégica com IA
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Enigma Strategist
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use o assistente especializado para obter análises estratégicas detalhadas da página atual.
          </p>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Contexto adicional (opcional):
            </label>
            <Textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="Adicione contexto específico para análise (ex: 'Foque na usabilidade mobile', 'Analise a conversão', etc.)"
              className="min-h-[80px] resize-none"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Análise Estratégica
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Análise concluída para a página: <strong>{result.route}</strong>
                <br />
                <span className="text-xs text-muted-foreground">
                  Gerada em: {new Date(result.timestamp).toLocaleString('pt-BR')}
                </span>
              </AlertDescription>
            </Alert>

            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Análise Estratégica Completa
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.analysis)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAnalysis(result.analysis, result.route)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {result.analysis}
                  </div>
                </div>
                <div className="mt-3 p-3 bg-purple-100 rounded text-xs text-purple-700">
                  <strong>💡 Dica:</strong> Esta análise foi gerada pelo Assistant Enigma Strategist especializado em estratégia digital. 
                  Use os botões acima para copiar ou baixar o conteúdo completo.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          Powered by OpenAI Assistant API • Enigma Strategist
        </div>
      </CardContent>
    </Card>
  );
};
