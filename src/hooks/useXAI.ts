
import { useState, useCallback } from 'react';
import { xaiService } from '@/services/xai';

export const useXAI = () => {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  const generateInsight = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return null;
    
    setLoading(true);
    try {
      console.log('Gerando insight com XAI:', prompt);
      const result = await xaiService.generateDevelopmentInsight(prompt);
      console.log('Insight gerado:', result);
      return result;
    } catch (error) {
      console.error('Erro ao gerar insight:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkConfiguration = useCallback(async () => {
    try {
      console.log('Verificando configuração XAI...');
      const isConfigured = xaiService.isConfigured();
      setConfigured(isConfigured);
    } catch (error) {
      console.error('Erro ao verificar configuração XAI:', error);
      setConfigured(false);
    }
  }, []);

  return {
    loading,
    configured,
    generateInsight,
    checkConfiguration
  };
};
