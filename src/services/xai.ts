
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

  constructor() {
    this.initializeApiKey();
  }

  private async initializeApiKey() {
    try {
      // Buscar a chave da API dos secrets do Supabase
      const { data, error } = await supabase.functions.invoke('get-xai-key');
      if (!error && data?.apiKey) {
        this.apiKey = data.apiKey;
      }
    } catch (error) {
      console.warn('XAI API key not configured:', error);
    }
  }

  async chat(messages: XAIMessage[], options: Partial<XAIRequest> = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('XAI API key not configured');
    }

    const request: XAIRequest = {
      model: 'grok-beta',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`XAI API error: ${response.status} ${response.statusText}`);
      }

      const data: XAIResponse = await response.json();
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
        content: 'Você é um assistente especializado em desenvolvimento web com React, TypeScript e Supabase. Forneça insights úteis e práticos para desenvolvimento.'
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
}

export const xaiService = new XAIService();
export type { XAIMessage, XAIRequest, XAIResponse };
