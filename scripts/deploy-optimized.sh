#!/bin/bash

# Deploy Optimizado - Sorriso Inteligente
echo "🚀 Iniciando deploy otimizado..."

# 1. Limpeza
echo "🧹 Limpando arquivos temporários..."
rm -rf dist node_modules/.vite .eslintcache

# 2. Verificação de tipos
echo "🔍 Verificando TypeScript..."
npm run type-check

# 3. Build otimizado
echo "🏗️ Fazendo build otimizado..."
npm run build

# 4. Verificação PWA
echo "📱 Verificando PWA..."
if [ -f "dist/sw.js" ]; then
    echo "✅ Service Worker gerado"
else
    echo "❌ Service Worker não encontrado"
    exit 1
fi

# 5. Deploy para Vercel
echo "🌐 Fazendo deploy para Vercel..."
npx vercel --prod

echo "✅ Deploy concluído com sucesso!"
echo "📊 Tamanho do bundle: $(du -sh dist | cut -f1)"
