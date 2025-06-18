
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  route: string;
  content: string;
  userContext?: string;
  aiModel?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { route, content, userContext, aiModel = 'gpt-4o-mini' }: AnalysisRequest = await req.json();

    console.log(`Iniciando análise direta da página: ${route} com modelo: ${aiModel}`);

    const messageContent = `Analise a página "${route}" do projeto Sorriso Inteligente.

Contexto da aplicação: PWA para clínicas odontológicas com React, TypeScript, Supabase, Tailwind CSS.

${userContext ? `Contexto adicional: ${userContext}` : ''}

Conteúdo da página atual:
${content}

Por favor, forneça uma análise estratégica detalhada incluindo:
1. Avaliação da experiência do usuário
2. Sugestões de melhorias técnicas
3. Oportunidades de otimização
4. Recomendações estratégicas
5. Próximos passos prioritários`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em estratégia digital, UX/UI e desenvolvimento web. Forneça análises detalhadas, práticas e acionáveis.'
          },
          {
            role: 'user',
            content: messageContent
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to get response from OpenAI: ${response.status}`, errorText);
      throw new Error(`Failed to get response from OpenAI: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Análise direta concluída com sucesso');

    return new Response(
      JSON.stringify({ 
        analysis,
        route,
        timestamp: new Date().toISOString(),
        aiUsed: aiModel,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro na análise direta com IA:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar análise com IA',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
