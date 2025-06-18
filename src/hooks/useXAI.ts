
import { useState, useCallback } from 'react';
import { xaiService } from '@/services/xai';

export const useXAI = () => {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  const generateInsight = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      console.warn('Prompt vazio fornecido');
      return null;
    }
    
    setLoading(true);
    try {
      console.log('🤖 Gerando insight com XAI:', prompt.substring(0, 100) + '...');
      const result = await xaiService.generateDevelopmentInsight(prompt);
      console.log('✅ Insight gerado:', result ? 'Sucesso' : 'Falhou');
      return result;
    } catch (error) {
      console.error('❌ Erro ao gerar insight:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkConfiguration = useCallback(async () => {
    try {
      console.log('🔍 Verificando configuração XAI...');
      
      // Forçar a inicialização da chave se necessário
      await xaiService.ensureInitialized();
      
      const isConfigured = xaiService.isConfigured();
      console.log('🔧 XAI configurado:', isConfigured);
      setConfigured(isConfigured);
      
      return isConfigured;
    } catch (error) {
      console.error('❌ Erro ao verificar configuração XAI:', error);
      setConfigured(false);
      return false;
    }
  }, []);

  const refreshConfiguration = useCallback(async () => {
    try {
      console.log('🔄 Atualizando configuração XAI...');
      await xaiService.refreshConfiguration();
      const isConfigured = xaiService.isConfigured();
      setConfigured(isConfigured);
      console.log('✅ Configuração atualizada:', isConfigured);
      return isConfigured;
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração XAI:', error);
      setConfigured(false);
      return false;
    }
  }, []);

  return {
    loading,
    configured,
    generateInsight,
    checkConfiguration,
    refreshConfiguration
  };
};
