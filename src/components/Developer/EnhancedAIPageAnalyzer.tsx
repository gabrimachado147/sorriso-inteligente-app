
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
import { PageSelector } from './PageSelector';
import { AISelector } from './AISelector';

interface AnalysisResult {
  analysis: string;
  route: string;
  timestamp: string;
  aiUsed: string;
}

export const EnhancedAIPageAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');
  const [selectedPage, setSelectedPage] = useState(window.location.pathname);
  const [selectedAI, setSelectedAI] = useState('asst_TWl3QmvNw0am7N05klbS5zJh'); // Seu assistant como padrão

  const handleAnalyzePage = async () => {
    if (!selectedPage) {
      setError('Por favor, selecione uma página para análise');
      return;
    }

    if (!selectedAI) {
      setError('Por favor, selecione uma IA para realizar a análise');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let content = '';
      
      // Se a página selecionada é a atual, usar o conteúdo da página
      if (selectedPage === window.location.pathname) {
        content = document.body.innerText || document.documentElement.innerText || '';
      } else {
        // Para outras páginas, vamos simular o conteúdo baseado na rota
        content = await fetchPageContent(selectedPage);
      }
      
      if (!content.trim()) {
        throw new Error('Não foi possível capturar o conteúdo da página');
      }

      console.log('🧠 Iniciando análise com IA:', selectedAI, 'para:', selectedPage);

      // Escolher a edge function baseada na IA selecionada
      const functionName = selectedAI.startsWith('asst_') ? 'ai-page-analyzer' : 'ai-page-analyzer-direct';

      const { data, error: functionError } = await supabase.functions.invoke(functionName, {
        body: {
          route: selectedPage,
          content: content.substring(0, 8000), // Limitar tamanho
          userContext: userContext.trim() || undefined,
          aiModel: selectedAI,
          assistantId: selectedAI.startsWith('asst_') ? selectedAI : undefined,
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Erro na comunicação com a IA');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        ...data,
        aiUsed: selectedAI
      });
      console.log('✅ Análise concluída com sucesso para:', selectedPage);

    } catch (err: any) {
      console.error('❌ Erro na análise:', err);
      setError(err.message || 'Erro desconhecido ao processar análise');
    } finally {
      setLoading(false);
    }
  };

  // Simular conteúdo para diferentes páginas
  const fetchPageContent = async (route: string): Promise<string> => {
    const pageContentMap: Record<string, string> = {
      '/': 'Página inicial do Sorriso Inteligente - PWA para clínicas odontológicas com agendamento, chat IA, localização de clínicas e perfil do usuário.',
      '/appointments': 'Sistema de agendamentos - interface para agendar consultas, selecionar horários, clínicas e serviços odontológicos.',
      '/chat': 'Chat com assistente virtual IA - interface conversacional para tirar dúvidas sobre tratamentos e agendamentos.',
      '/clinics': 'Listagem de clínicas - mapa e informações detalhadas das clínicas parceiras com localização e serviços.',
      '/profile': 'Perfil do usuário - configurações pessoais, histórico de agendamentos e preferências.',
      '/admin': 'Dashboard administrativo - painel para gestão de clínicas, agendamentos e relatórios.',
      '/analytics': 'Página de analytics - relatórios e métricas do sistema, dashboards de performance.',
      '/gamification': 'Sistema de gamificação - pontos, conquistas e engajamento do usuário.',
      '/reminders': 'Gerenciamento de lembretes - notificações e alertas para consultas e tratamentos.'
    };

    return pageContentMap[route] || `Conteúdo da página ${route} - análise de uma página do sistema Sorriso Inteligente.`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAnalysis = (analysis: string, route: string, aiUsed: string) => {
    const blob = new Blob([analysis], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-${aiUsed.replace('asst_', '').substring(0, 8)}-${route.replace(/\//g, '-') || 'pagina'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAIDisplayName = (aiId: string) => {
    if (aiId === 'asst_TWl3QmvNw0am7N05klbS5zJh') return 'Enigma Strategist (Seu Assistant)';
    if (aiId === 'gpt-4o-mini') return 'GPT-4o Mini';
    if (aiId === 'gpt-4o') return 'GPT-4o';
    return aiId;
  };

  return (
    <div className="space-y-6">
      <AISelector
        selectedAI={selectedAI}
        onAIChange={setSelectedAI}
      />

      <PageSelector
        selectedPage={selectedPage}
        onPageChange={setSelectedPage}
        onAnalyzePage={handleAnalyzePage}
        loading={loading}
      />

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Configuração de Análise Estratégica
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {getAIDisplayName(selectedAI)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Configure o contexto adicional para personalizar sua análise estratégica.
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
                    IA utilizada: {getAIDisplayName(result.aiUsed)} | Gerada em: {new Date(result.timestamp).toLocaleString('pt-BR')}
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
                        onClick={() => downloadAnalysis(result.analysis, result.route, result.aiUsed)}
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
                    <strong>💡 Dica:</strong> Esta análise foi gerada pela IA {getAIDisplayName(result.aiUsed)}. 
                    Use os botões acima para copiar ou baixar o conteúdo completo.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground pt-2 border-t">
            Powered by OpenAI Assistant API • IA Configurável
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
