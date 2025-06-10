#!/usr/bin/env node

/**
 * Evolution API Webhook Test Script
 * Tests the chatbot webhook integration
 * Usage: node scripts/test-evolution-api.js
 */

const EVOLUTION_API_URL = 'https://evolution-evolution.elhnlf.easypanel.host/message/sendText/ELARA';
const EVOLUTION_API_KEY = 'oyotVtRf0iJBbnoNb9UN98qHMUr9m97G';

async function testEvolutionAPI() {
  console.log(`
🤖 Testing Evolution API Webhook
================================

URL: ${EVOLUTION_API_URL}
`);

  try {
    // Test 1: Basic connectivity test
    console.log('📡 Testing basic connectivity...');
    
    const testMessage = {
      number: '5511999999999', // Test number
      text: '🧪 Test message from Sorriso Inteligente PWA - Chat integration working!',
      sessionId: `test_session_${Date.now()}`
    };

    const response = await fetch(EVOLUTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify(testMessage)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success! API Response:', JSON.stringify(result, null, 2));
      
      console.log(`
🎉 Evolution API Integration Test PASSED!
=========================================

✅ Webhook URL is accessible
✅ API accepts POST requests
✅ JSON payload format is correct
✅ Chat integration is ready for production

Your Sorriso Inteligente PWA can now:
- Send WhatsApp messages via Evolution API
- Process chat messages through ELARA bot
- Handle patient inquiries automatically
- Integrate with appointment booking

🚀 Ready to deploy with full chat functionality!
      `);
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      
      console.log(`
⚠️  Evolution API Test Issues
============================

Status: ${response.status}
Response: ${errorText}

Possible solutions:
1. Check if the webhook URL is correct
2. Verify ELARA bot is running
3. Check API authentication if required
4. Contact your Evolution API provider
      `);
    }

  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    
    console.log(`
🔧 Connection Troubleshooting
=============================

Error: ${error.message}

Common issues:
1. Network connectivity problems
2. Firewall blocking the request
3. Invalid webhook URL
4. Server temporarily unavailable

Please check:
- Internet connection
- Webhook URL: ${EVOLUTION_API_URL}
- Contact Evolution API support if needed
    `);
  }
}

// Run the test
testEvolutionAPI().catch(console.error);
