#!/usr/bin/env node
/**
 * Configuração do Codacy MCP Server
 * Script para configurar credenciais e validar conexão
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function validateCodacyConnection(config) {
  const axios = require('axios');
  
  try {
    const url = `https://app.codacy.com/api/v3/projects/${config.organizationProvider}/${config.username}/${config.projectName}`;
    
    const response = await axios.get(url, {
      headers: {
        'api-token': config.apiToken,
      },
    });
    
    console.log('✅ Conexão com Codacy validada com sucesso!');
    console.log(`📊 Projeto: ${response.data.name}`);
    console.log(`🏆 Nota de Qualidade: ${response.data.grade || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Falha na validação da conexão:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Configuração do Codacy MCP Server\n');
  
  // Verificar se já existe configuração
  const configPath = path.join(__dirname, '..', '.env.codacy');
  let existingConfig = {};
  
  try {
    const existingContent = await fs.readFile(configPath, 'utf8');
    const lines = existingContent.split('\n');
    for (const line of lines) {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        existingConfig[key] = value;
      }
    }
    console.log('📄 Configuração existente encontrada\n');
  } catch (error) {
    console.log('📄 Criando nova configuração\n');
  }
  
  // Coletar informações
  const apiToken = await askQuestion(`🔑 Codacy API Token [${existingConfig.CODACY_API_TOKEN || 'eJzda2H97ZUpnBA47FNt'}]: `) || existingConfig.CODACY_API_TOKEN || 'eJzda2H97ZUpnBA47FNt';
  
  const orgProvider = await askQuestion(`🏢 Organization Provider [${existingConfig.CODACY_ORGANIZATION_PROVIDER || 'gh'}]: `) || existingConfig.CODACY_ORGANIZATION_PROVIDER || 'gh';
  
  const username = await askQuestion(`👤 Username [${existingConfig.CODACY_USERNAME || 'gabrimachado147'}]: `) || existingConfig.CODACY_USERNAME || 'gabrimachado147';
  
  const projectName = await askQuestion(`📦 Project Name [${existingConfig.CODACY_PROJECT_NAME || 'sorriso-inteligente-app'}]: `) || existingConfig.CODACY_PROJECT_NAME || 'sorriso-inteligente-app';
  
  const config = {
    apiToken,
    organizationProvider: orgProvider,
    username,
    projectName,
  };
  
  // Validar conexão
  console.log('\n🔍 Validando conexão com Codacy...');
  const isValid = await validateCodacyConnection(config);
  
  if (!isValid) {
    console.log('\n❌ Configuração inválida. Verifique os dados e tente novamente.');
    rl.close();
    return;
  }
  
  // Salvar configuração
  const envContent = `# Codacy MCP Server Configuration
# Configuração do servidor MCP da Codacy

CODACY_API_TOKEN=${config.apiToken}
CODACY_ORGANIZATION_PROVIDER=${config.organizationProvider}
CODACY_USERNAME=${config.username}
CODACY_PROJECT_NAME=${config.projectName}

# MCP Server Configuration
MCP_SERVER_NAME=codacy
MCP_SERVER_VERSION=1.0.0
MCP_SERVER_PORT=3000

# Local development
# Para usar localmente, execute:
# source .env.codacy
`;
  
  await fs.writeFile(configPath, envContent);
  
  // Criar arquivo de configuração MCP
  const mcpConfigPath = path.join(__dirname, 'config', 'mcp-config.json');
  await fs.mkdir(path.dirname(mcpConfigPath), { recursive: true });
  
  const mcpConfig = {
    server: {
      name: 'codacy',
      version: '1.0.0',
      description: 'Codacy code quality analysis server',
      command: process.platform === 'win32' ? 'node' : 'node',
      args: [path.join(__dirname, 'codacy-mcp-server.js')],
      env: {
        CODACY_API_TOKEN: config.apiToken,
        CODACY_ORGANIZATION_PROVIDER: config.organizationProvider,
        CODACY_USERNAME: config.username,
        CODACY_PROJECT_NAME: config.projectName,
      },
    },
    tools: [
      {
        name: 'analyze_code_quality',
        description: 'Analisa qualidade do código',
      },
      {
        name: 'upload_coverage',
        description: 'Envia cobertura de testes',
      },
      {
        name: 'get_project_metrics',
        description: 'Obtém métricas do projeto',
      },
      {
        name: 'get_pull_request_analysis',
        description: 'Analisa pull requests',
      },
      {
        name: 'configure_quality_gates',
        description: 'Configura quality gates',
      },
    ],
  };
  
  await fs.writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
  
  console.log('\n✅ Configuração concluída com sucesso!');
  console.log('\n📁 Arquivos criados:');
  console.log(`   📄 ${configPath}`);
  console.log(`   📄 ${mcpConfigPath}`);
  
  console.log('\n🚀 Para iniciar o servidor MCP:');
  console.log('   npm start');
  
  console.log('\n🔧 Para usar em Claude Desktop:');
  console.log('   Adicione a configuração do mcp-config.json ao seu claude_desktop_config.json');
  
  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
