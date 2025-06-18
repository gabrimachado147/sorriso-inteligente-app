
import { useState } from 'react';
import { useXAI } from '@/hooks/useXAI';

export const useXAIInsightPanel = (onInsight?: (insight: string) => void) => {
  const [prompt, setPrompt] = useState('');
  const [insight, setInsight] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const { loading, configured, generateInsight, checkConfiguration, refreshConfiguration } = useXAI();

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
