#!/bin/bash

# Codacy MCP Server - Installation Script
# Script para instalação e configuração do servidor MCP da Codacy

set -e

echo "🚀 Instalando Codacy MCP Server..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Navegar para diretório do MCP server
cd "$(dirname "$0")"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Tornar scripts executáveis
chmod +x scripts/configure.js
chmod +x codacy-mcp-server.js

# Executar configuração
echo "⚙️ Iniciando configuração..."
npm run configure

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "🔧 Próximos passos:"
echo "   1. Adicione a configuração ao Claude Desktop:"
echo "      cp config/mcp-config.json ~/.config/claude-desktop/"
echo ""
echo "   2. Inicie o servidor:"
echo "      npm start"
echo ""
echo "   3. Teste a conexão:"
echo "      curl -X POST http://localhost:3000/health"
echo ""
echo "📖 Consulte o README.md para mais informações"
