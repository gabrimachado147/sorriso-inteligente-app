
import { useState, useCallback } from 'react';
import { XAIService } from '@/services/xai';

export const useXAI = () => {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  const generateInsight = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return null;
    
    setLoading(true);
    try {
      console.log('Gerando insight com XAI:', prompt);
      const result = await XAIService.chat(prompt);
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
      // Simular verificação de configuração
      console.log('Verificando configuração XAI...');
      setConfigured(true); // Por enquanto, sempre configurado para desenvolvimento
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
