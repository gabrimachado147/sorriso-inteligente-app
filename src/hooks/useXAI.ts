
import { useState, useCallback } from 'react';
import { xaiService, type XAIMessage } from '@/services/xai';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';

export const useXAI = () => {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  const checkConfiguration = useCallback(async () => {
    const isConfigured = xaiService.isConfigured();
    setConfigured(isConfigured);
    return isConfigured;
  }, []);

  const generateInsight = useCallback(async (prompt: string): Promise<string | null> => {
    if (!xaiService.isConfigured()) {
      toastError('XAI não configurado', 'A API key do Grok/xAI não foi configurada');
      return null;
    }

    setLoading(true);
    try {
      const insight = await xaiService.generateDevelopmentInsight(prompt);
      toastSuccess('Insight gerado', 'Análise do Grok concluída com sucesso');
      return insight;
    } catch (error) {
      console.error('Erro ao gerar insight:', error);
      toastError('Erro no Grok', 'Não foi possível gerar o insight');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (messages: XAIMessage[]): Promise<string | null> => {
    if (!xaiService.isConfigured()) {
      toastError('XAI não configurado', 'A API key do Grok/xAI não foi configurada');
      return null;
    }

    setLoading(true);
    try {
      const response = await xaiService.chat(messages);
      return response;
    } catch (error) {
      console.error('Erro no chat XAI:', error);
      toastError('Erro no Chat', 'Não foi possível processar a mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    configured,
    checkConfiguration,
    generateInsight,
    chat
  };
};
