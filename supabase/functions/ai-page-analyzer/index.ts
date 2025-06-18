
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = 'asst_TWl3QmvNw0am7N05klbS5zJh'; // Enigma Strategist

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  route: string;
  content: string;
  userContext?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { route, content, userContext }: AnalysisRequest = await req.json();

    console.log(`Iniciando análise da página: ${route}`);

    // 1. Criar Thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!threadResponse.ok) {
      throw new Error(`Failed to create thread: ${threadResponse.statusText}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;

    // 2. Enviar mensagem com contexto da página
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

    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent,
      }),
    });

    // 3. Executar o Assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
      }),
    });

    const run = await runResponse.json();
    const runId = run.id;

    // 4. Aguardar conclusão da execução
    let runStatus = 'in_progress';
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo

    while (runStatus === 'in_progress' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
      });

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error(`Run did not complete. Status: ${runStatus}`);
    }

    // 5. Obter resposta
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
    });

    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');
    
    if (!assistantMessage || !assistantMessage.content || !assistantMessage.content[0]) {
      throw new Error('No assistant response found');
    }

    const analysis = assistantMessage.content[0].text.value;

    console.log('Análise concluída com sucesso');

    return new Response(
      JSON.stringify({ 
        analysis,
        route,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro na análise com IA:', error);
    
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
