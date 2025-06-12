#!/bin/bash

# Sorriso Inteligente - Quality Check Script
# This script performs comprehensive quality checks for the dental application

echo "🔍 Iniciando verificação de qualidade do Sorriso Inteligente..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. TypeScript Type Checking
echo -e "\n📝 Verificando tipos TypeScript..."
npx tsc --noEmit
print_status $? "Verificação de tipos TypeScript"

# 2. ESLint Analysis
echo -e "\n🔍 Executando análise ESLint..."
npx eslint src/ --ext .ts,.tsx --max-warnings 0
print_status $? "Análise ESLint"

# 3. Build Verification
echo -e "\n🏗️  Verificando build de produção..."
npm run build > /dev/null 2>&1
print_status $? "Build de produção"

# 4. Test Coverage
echo -e "\n🧪 Executando testes com cobertura..."
npm run test:coverage > /dev/null 2>&1
print_status $? "Testes com cobertura"

# 5. Check Coverage Threshold
if [ -f "coverage/coverage-summary.json" ]; then
    COVERAGE=$(node -e "
        try {
            const data = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json', 'utf8'));
            const pct = data.total.lines.pct;
            console.log(Math.round(pct || 0));
        } catch(e) {
            console.log(0);
        }
    " 2>/dev/null || echo "0")
    
    if [ "$COVERAGE" -ge 70 ]; then
        print_status 0 "Cobertura de testes: $COVERAGE% (≥70%)"
    else
        print_warning "Cobertura de testes: $COVERAGE% (abaixo de 70%)"
    fi
else
    print_warning "Arquivo de resumo de cobertura não encontrado"
fi

# 6. Bundle Size Check
if [ -f "dist/index.html" ]; then
    BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
    echo -e "${GREEN}📦 Tamanho do bundle: $BUNDLE_SIZE${NC}"
fi

# 7. Security Audit
echo -e "\n🔒 Verificando vulnerabilidades de segurança..."
npm audit --audit-level high
print_status $? "Auditoria de segurança"

# 8. Dependencies Check
echo -e "\n📦 Verificando dependências desatualizadas..."
npm outdated || true

echo -e "\n${GREEN}🎉 Todas as verificações de qualidade foram concluídas!${NC}"
echo -e "${GREEN}✨ Projeto Sorriso Inteligente pronto para produção!${NC}"