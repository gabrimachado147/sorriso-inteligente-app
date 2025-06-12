#!/bin/bash

# Codacy Coverage Configuration
export CODACY_API_TOKEN=eJzda2H97ZUpnBA47FNt
export CODACY_ORGANIZATION_PROVIDER=gh
export CODACY_USERNAME=gabrimachado147
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
