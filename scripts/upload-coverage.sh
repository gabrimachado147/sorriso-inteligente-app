#!/bin/bash

# Sorriso Inteligente - Coverage Upload Script
# This script uploads test coverage to Codacy

echo "📊 Fazendo upload da cobertura de testes para o Codacy..."

# Codacy Coverage Configuration
export CODACY_API_TOKEN=eJzda2H97ZUpnBA47FNt
export CODACY_ORGANIZATION_PROVIDER=gh
export CODACY_USERNAME=gabrimachado147
export CODACY_PROJECT_NAME=sorriso-inteligente-app-main

# Check if coverage file exists
if [ ! -f "coverage/lcov.info" ]; then
    echo "❌ Arquivo de cobertura não encontrado. Execute 'npm run test:coverage' primeiro."
    exit 1
fi

# Check if Codacy token is set
if [ -z "$CODACY_PROJECT_TOKEN" ]; then
    echo "⚠️  CODACY_PROJECT_TOKEN não está definido."
    echo "Para configurar:"
    echo "export CODACY_PROJECT_TOKEN=your_token_here"
    exit 1
fi

# Upload coverage to Codacy
echo "🚀 Fazendo upload para Codacy..."
npx codacy-coverage -r coverage/lcov.info

if [ $? -eq 0 ]; then
    echo "✅ Cobertura enviada com sucesso para o Codacy!"
else
    echo "❌ Erro ao enviar cobertura para o Codacy."
    exit 1
fi
export CODACY_PROJECT_NAME=sorriso-inteligente-app

echo "🔧 Codacy environment variables configured"
echo "📊 Organization: $CODACY_ORGANIZATION_PROVIDER/$CODACY_USERNAME"
echo "📁 Project: $CODACY_PROJECT_NAME"

# Run tests with coverage
echo "🧪 Running tests with coverage..."
npm run test -- --coverage

# Check if coverage file exists
if [ -f "coverage/lcov.info" ]; then
    echo "✅ Coverage file found: coverage/lcov.info"
    
    # Upload coverage to Codacy
    echo "📤 Uploading coverage to Codacy..."
    bash <(curl -Ls https://coverage.codacy.com/get.sh)
    
    echo "🎉 Coverage uploaded successfully!"
else
    echo "❌ Coverage file not found. Make sure tests are generating coverage."
    exit 1
fi
