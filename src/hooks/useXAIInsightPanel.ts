
import { useState } from 'react';
import { useXAI } from '@/hooks/useXAI';

export const useXAIInsightPanel = (onInsight?: (insight: string) => void) => {
  const [prompt, setPrompt] = useState('');
  const [insight, setInsight] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const { loading, configured, generateInsight, checkConfiguration, refreshConfiguration } = useXAI();

  const handleGenerateInsight = async () => {
    if (!prompt.trim()) {
      console.warn('Prompt vazio');
      return;
    }

    console.log('🤖 Iniciando geração de insight:', prompt.substring(0, 50) + '...');
    
    try {
      const result = await generateInsight(prompt);
      if (result) {
        console.log('✅ Insight gerado com sucesso');
        setInsight(result);
        onInsight?.(result);
      } else {
        console.error('❌ Falha na geração do insight');
        setInsight('Erro ao gerar insight. Verifique a configuração da API ou tente novamente.');
      }
    } catch (error) {
      console.error('❌ Erro ao gerar insight:', error);
      setInsight('Erro inesperado ao gerar insight. Verifique a configuração e tente novamente.');
    }
  };

  const handleRefreshConfig = async () => {
    console.log('🔄 Atualizando configuração XAI...');
    try {
      await refreshConfiguration();
      console.log('✅ Configuração atualizada');
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
    }
  };

  return {
    prompt,
    setPrompt,
    insight,
    setInsight,
    expandedPrompt,
    setExpandedPrompt,
    loading,
    configured,
    handleGenerateInsight,
    handleRefreshConfig,
    checkConfiguration
  };
};
