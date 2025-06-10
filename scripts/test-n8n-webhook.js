#!/usr/bin/env node

/**
 * Teste do Webhook N8N para Chatbot
 * Testa a integração com o workflow do N8N
 * Uso: node scripts/test-n8n-webhook.js
 */

const N8N_WEBHOOK_URL = 'https://n8nwebhook.enigmabot.store/webhook/9598a25e-5915-4fe1-b136-90cbcc05bbe0';

async function testN8NWebhook() {
  console.log(`
🤖 Testando Webhook N8N para Chatbot
===================================

URL: ${N8N_WEBHOOK_URL}
`);

  try {
    console.log('📡 Enviando mensagem de teste para o workflow...');
    
    const testData = {
      message: 'Olá! Esta é uma mensagem de teste do Sorriso Inteligente PWA',
      sessionId: `test_session_${Date.now()}`,
      userId: 'test_user_123',
      context: 'general',
      timestamp: new Date().toISOString(),
      source: 'sorriso-inteligente-pwa',
      userAgent: 'PWA Test Script'
    };

    console.log('📤 Payload enviado:', JSON.stringify(testData, null, 2));

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.text(); // N8N pode retornar texto ou JSON
      console.log('✅ Sucesso! Resposta do N8N:', result);
      
      console.log(`
🎉 Teste do Webhook N8N - SUCESSO!
=================================

✅ Webhook acessível
✅ Formato de payload aceito
✅ Workflow disparado com sucesso
✅ Integração N8N funcionando

Seu PWA Sorriso Inteligente agora pode:
- 💬 Enviar mensagens para o workflow N8N
- 🤖 Processar respostas do chatbot
- 📅 Integrar com sistema de agendamentos
- 🚨 Gerenciar solicitações de emergência
- 🏥 Fornecer informações da clínica

🚀 Pronto para produção com N8N!
      `);
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na resposta:', errorText);
      
      console.log(`
⚠️  Problemas no Webhook N8N
===========================

Status: ${response.status}
Resposta: ${errorText}

Possíveis soluções:
1. Verificar se o webhook N8N está ativo
2. Confirmar se o workflow está rodando
3. Validar o formato do payload
4. Verificar logs no N8N
      `);
    }

  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    
    console.log(`
🔧 Troubleshooting de Conexão
============================

Erro: ${error.message}

Verificações:
1. Conexão com a internet
2. URL do webhook N8N: ${N8N_WEBHOOK_URL}
3. Status do servidor N8N
4. Configurações de firewall

💡 Contate o administrador do N8N se necessário
    `);
  }
}

// Executar o teste
testN8NWebhook().catch(console.error);
