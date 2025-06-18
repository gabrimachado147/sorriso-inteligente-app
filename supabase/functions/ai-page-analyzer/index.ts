
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const DEFAULT_ASSISTANT_ID = 'asst_TWl3QmvNw0am7N05klbS5zJh'; // Seu assistant como padrão

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  route: string;
  content: string;
  userContext?: string;
  assistantId?: string;
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
    const { route, content, userContext, assistantId = DEFAULT_ASSISTANT_ID }: AnalysisRequest = await req.json();

    console.log(`Iniciando análise da página: ${route} com assistant: ${assistantId}`);

    // 1. Criar Thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({}),
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error(`Failed to create thread: ${threadResponse.status} ${threadResponse.statusText}`, errorText);
      throw new Error(`Failed to create thread: ${threadResponse.statusText}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log(`Thread criada: ${threadId}`);

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

    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent,
      }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error(`Failed to create message: ${messageResponse.status}`, errorText);
      throw new Error(`Failed to create message: ${messageResponse.statusText}`);
    }

    console.log('Mensagem enviada para o thread');

    // 3. Executar o Assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error(`Failed to create run: ${runResponse.status}`, errorText);
      throw new Error(`Failed to create run: ${runResponse.statusText}`);
    }

    const run = await runResponse.json();
    const runId = run.id;
    console.log(`Run iniciada: ${runId}`);

    // 4. Aguardar conclusão da execução
    let runStatus = 'in_progress';
    let attempts = 0;
    const maxAttempts = 60; // 60 segundos máximo

    while (runStatus === 'in_progress' || runStatus === 'queued') {
      if (attempts >= maxAttempts) {
        throw new Error('Timeout: Run took too long to complete');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check run status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;

      console.log(`Status da run (tentativa ${attempts}): ${runStatus}`);
    }

    if (runStatus !== 'completed') {
      console.error(`Run failed with status: ${runStatus}`);
      throw new Error(`Run did not complete successfully. Status: ${runStatus}`);
    }

    console.log('Run completada com sucesso');

    // 5. Obter resposta
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesResponse.ok) {
      throw new Error(`Failed to fetch messages: ${messagesResponse.statusText}`);
    }

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
        aiUsed: assistantId,
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
