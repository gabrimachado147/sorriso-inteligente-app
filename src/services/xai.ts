
import { supabase } from '@/integrations/supabase/client';

interface XAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface XAIRequest {
  model: string;
  messages: XAIMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface XAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class XAIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.x.ai/v1';
  private initialized = false;

  constructor() {
    this.initializeApiKey();
  }

  private async initializeApiKey() {
    if (this.initialized) return;
    
    try {
      console.log('Inicializando chave XAI...');
      const { data, error } = await supabase.functions.invoke('get-xai-key');
      if (!error && data?.apiKey) {
        this.apiKey = data.apiKey;
        console.log('Chave XAI configurada com sucesso');
      } else {
        console.warn('XAI API key not found in Supabase secrets');
      }
    } catch (error) {
      console.warn('Erro ao buscar chave XAI:', error);
    } finally {
      this.initialized = true;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeApiKey();
    }
  }

  async chat(messages: XAIMessage[], options: Partial<XAIRequest> = {}): Promise<string> {
    await this.ensureInitialized();
    
    if (!this.apiKey) {
      throw new Error('XAI API key not configured');
    }

    const request: XAIRequest = {
      model: 'grok-2-1212',  // Modelo atualizado que existe
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options
    };

    try {
      console.log('Enviando request para XAI:', { model: request.model, messagesCount: messages.length });
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('XAI API error:', response.status, errorText);
        
        // Mensagem de erro mais específica
        if (response.status === 404) {
          throw new Error(`Modelo não encontrado. Verifique se o modelo ${request.model} está disponível.`);
        } else if (response.status === 401) {
          throw new Error('Chave da API inválida. Verifique sua configuração.');
        } else {
          throw new Error(`Erro da API XAI: ${response.status} - ${errorText}`);
        }
      }

      const data: XAIResponse = await response.json();
      console.log('Resposta recebida do XAI:', data.choices[0]?.message?.content?.substring(0, 100) + '...');
      return data.choices[0]?.message?.content || 'Resposta não disponível';
    } catch (error) {
      console.error('XAI Service error:', error);
      throw error;
    }
  }

  async generateDevelopmentInsight(prompt: string): Promise<string> {
    const messages: XAIMessage[] = [
      {
        role: 'system',
        content: `Você é um assistente especializado em desenvolvimento web com React, TypeScript e Supabase. 
        Você está analisando o projeto "Sorriso Inteligente", um PWA para clínicas odontológicas.
        Forneça insights úteis, práticos e específicos para desenvolvimento.
        Responda em português brasileiro de forma clara e objetiva.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return this.chat(messages);
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async refreshConfiguration() {
    this.initialized = false;
    this.apiKey = null;
    await this.initializeApiKey();
  }
}

export const xaiService = new XAIService();
export type { XAIMessage, XAIRequest, XAIResponse };
