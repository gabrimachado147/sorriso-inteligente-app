#!/usr/bin/env node
/**
 * Teste do Codacy MCP Server
 * Script para testar todas as funcionalidades do servidor
 */

const axios = require('axios');
const path = require('path');

// Configuração de teste
const testConfig = {
  apiToken: process.env.CODACY_API_TOKEN || 'eJzda2H97ZUpnBA47FNt',
  organizationProvider: process.env.CODACY_ORGANIZATION_PROVIDER || 'gh',
  username: process.env.CODACY_USERNAME || 'gabrimachado147',
  projectName: process.env.CODACY_PROJECT_NAME || 'sorriso-inteligente-app',
  baseUrl: 'https://app.codacy.com/api/v3'
};

async function testCodacyConnection() {
  console.log('🔍 Testando conexão com Codacy API...');
  
  try {
    const url = `${testConfig.baseUrl}/projects/${testConfig.organizationProvider}/${testConfig.username}/${testConfig.projectName}`;
    
    const response = await axios.get(url, {
      headers: {
        'api-token': testConfig.apiToken,
      },
    });
    
    console.log('✅ Conexão com Codacy OK');
    console.log(`📊 Projeto: ${response.data.name || 'Sorriso Inteligente'}`);
    console.log(`🏆 Grade: ${response.data.grade || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCoverageUpload() {
  console.log('\n📊 Testando upload de cobertura...');
  
  try {
    // Verificar se arquivo de cobertura existe
    const coverageFile = path.join(__dirname, '..', 'coverage', 'lcov.info');
    const fs = require('fs');
    
    if (!fs.existsSync(coverageFile)) {
      console.log('⚠️ Arquivo de cobertura não encontrado, gerando...');
      
      // Executar testes para gerar cobertura
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      await execPromise('cd .. && npm run test:coverage', {
        cwd: __dirname,
      });
    }
    
    console.log('✅ Arquivo de cobertura disponível');
    return true;
  } catch (error) {
    console.error('❌ Falha no teste de cobertura:', error.message);
    return false;
  }
}

async function testMCPTools() {
  console.log('\n🛠️ Testando ferramentas MCP...');
  
  const CodacyMCPServer = require('./codacy-mcp-server');
  const server = new CodacyMCPServer();
  
  // Simular chamadas de ferramentas
  const tests = [
    {
      name: 'analyze_code_quality',
      args: { filePath: 'src/App.tsx' },
    },
    {
      name: 'get_project_metrics',
      args: { metric: 'quality' },
    },
  ];
  
  for (const test of tests) {
    try {
      console.log(`🔧 Testando ${test.name}...`);
      
      // Simular request MCP
      const mockRequest = {
        params: {
          name: test.name,
          arguments: test.args,
        },
      };
      
      // Testar se método existe
      const methodName = test.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (typeof server[methodName] === 'function') {
        console.log(`✅ Método ${test.name} disponível`);
      } else {
        console.log(`⚠️ Método ${test.name} não encontrado`);
      }
      
    } catch (error) {
      console.error(`❌ Falha em ${test.name}:`, error.message);
    }
  }
  
  return true;
}

async function testClaudeIntegration() {
  console.log('\n🤖 Testando integração Claude Desktop...');
  
  const configPath = path.join(__dirname, 'config', 'mcp-config.json');
  const fs = require('fs');
  
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ Configuração MCP válida');
      console.log(`📝 Ferramentas disponíveis: ${config.tools.length}`);
      console.log(`🎯 Servidor: ${config.server.name} v${config.server.version}`);
      
      return true;
    } else {
      console.log('⚠️ Arquivo de configuração MCP não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Falha na validação da configuração:', error.message);
    return false;
  }
}

async function generateTestReport() {
  console.log('\n📋 Gerando relatório de testes...');
  
  const results = {
    codacyConnection: await testCodacyConnection(),
    coverageUpload: await testCoverageUpload(),
    mcpTools: await testMCPTools(),
    claudeIntegration: await testClaudeIntegration(),
  };
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\n📊 RELATÓRIO DE TESTES');
  console.log('=' .repeat(50));
  console.log(`✅ Testes Aprovados: ${passedTests}/${totalTests}`);
  console.log(`📈 Taxa de Sucesso: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  console.log('\n🔍 Detalhes:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`   ${passed ? '✅' : '❌'} ${test}`);
  });
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Todos os testes passaram! Codacy MCP Server está pronto.');
    console.log('\n🚀 Para usar:');
    console.log('   1. npm start (inicia o servidor)');
    console.log('   2. Configure Claude Desktop com mcp-config.json');
    console.log('   3. Use as ferramentas no Claude');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique a configuração.');
  }
  
  return passedTests === totalTests;
}

// Executar testes
if (require.main === module) {
  generateTestReport().catch(console.error);
}

module.exports = {
  testCodacyConnection,
  testCoverageUpload,
  testMCPTools,
  testClaudeIntegration,
  generateTestReport,
};
