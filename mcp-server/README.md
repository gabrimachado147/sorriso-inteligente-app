# 🔧 Codacy MCP Server

**Model Context Protocol Server** para integração da **Codacy** com análise de qualidade de código em tempo real.

## 🎯 **Visão Geral**

Este servidor MCP permite que você integre a **Codacy** diretamente com **Claude Desktop** e outras ferramentas compatíveis com MCP, fornecendo capacidades avançadas de análise de código, upload de cobertura e monitoramento de qualidade.

## ✨ **Funcionalidades**

### 🔍 **Análise de Código**
- **Análise de qualidade**: Verifica issues, bugs e code smells
- **Métricas detalhadas**: Severidade, categoria e recomendações
- **Análise por arquivo**: Foco em arquivos específicos

### 📊 **Cobertura de Testes**
- **Upload automático**: Envia relatórios LCOV para Codacy
- **Monitoramento**: Acompanha mudanças na cobertura
- **Integração CI/CD**: Suporte para pipelines automatizados

### 📈 **Métricas do Projeto**
- **Quality Score**: Nota geral de qualidade
- **Coverage**: Porcentagem de cobertura de testes  
- **Duplication**: Análise de código duplicado
- **Complexity**: Complexidade ciclomática

### 🔄 **Análise de Pull Requests**
- **Review automático**: Análise de mudanças em PRs
- **Comparação**: Antes vs depois das alterações
- **Bloqueio**: Quality gates para aprovação

## 🚀 **Instalação Rápida**

### 1. **Instalar Dependências**
```bash
cd mcp-server
npm install
```

### 2. **Configurar Credenciais**
```bash
npm run configure
```

### 3. **Iniciar Servidor**
```bash
npm start
```

## ⚙️ **Configuração Detalhada**

### **Variáveis de Ambiente**
Crie o arquivo `.env.codacy` na raiz do projeto:

```bash
# Codacy API Configuration
CODACY_API_TOKEN=eJzda2H97ZUpnBA47FNt
CODACY_ORGANIZATION_PROVIDER=gh
CODACY_USERNAME=gabrimachado147
CODACY_PROJECT_NAME=sorriso-inteligente-app

# MCP Server Configuration  
MCP_SERVER_NAME=codacy
MCP_SERVER_VERSION=1.0.0
MCP_SERVER_PORT=3000
```

### **Claude Desktop Integration**
Adicione ao seu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "codacy": {
      "command": "node",
      "args": ["/path/to/mcp-server/codacy-mcp-server.js"],
      "env": {
        "CODACY_API_TOKEN": "eJzda2H97ZUpnBA47FNt",
        "CODACY_ORGANIZATION_PROVIDER": "gh", 
        "CODACY_USERNAME": "gabrimachado147",
        "CODACY_PROJECT_NAME": "sorriso-inteligente-app"
      }
    }
  }
}
```

## 🛠️ **Ferramentas Disponíveis**

### 1. **`analyze_code_quality`**
Analisa a qualidade de um arquivo específico.

**Parâmetros:**
- `filePath` (string): Caminho do arquivo
- `commitSha` (string, opcional): SHA do commit

**Exemplo:**
```javascript
{
  "filePath": "src/components/App.tsx",
  "commitSha": "abc123"
}
```

### 2. **`upload_coverage`**
Envia relatório de cobertura para Codacy.

**Parâmetros:**
- `coverageFile` (string): Caminho para lcov.info
- `commitSha` (string, opcional): SHA do commit

**Exemplo:**
```javascript
{
  "coverageFile": "coverage/lcov.info",
  "commitSha": "abc123"
}
```

### 3. **`get_project_metrics`**
Obtém métricas específicas do projeto.

**Parâmetros:**
- `metric` (enum): `quality`, `coverage`, `duplication`, `complexity`

**Exemplo:**
```javascript
{
  "metric": "coverage"
}
```

### 4. **`get_pull_request_analysis`**
Analisa um pull request específico.

**Parâmetros:**
- `pullRequestNumber` (number): Número do PR

**Exemplo:**
```javascript
{
  "pullRequestNumber": 42
}
```

### 5. **`configure_quality_gates`**
Configura quality gates do projeto.

**Parâmetros:**
- `coverageThreshold` (number, opcional): Threshold de cobertura
- `qualityGrade` (string, opcional): Nota mínima (A, B, C, D)

**Exemplo:**
```javascript
{
  "coverageThreshold": 80,
  "qualityGrade": "B"
}
```

## 📝 **Exemplos de Uso**

### **Análise de Arquivo**
```bash
# Via Claude Desktop
Analise a qualidade do arquivo src/App.tsx usando Codacy
```

### **Upload de Cobertura**
```bash
# Via Claude Desktop  
Envie o relatório de cobertura coverage/lcov.info para Codacy
```

### **Métricas do Projeto**
```bash
# Via Claude Desktop
Mostre as métricas de cobertura do projeto
```

## 🔧 **Desenvolvimento**

### **Estrutura do Projeto**
```
mcp-server/
├── codacy-mcp-server.js    # Servidor principal
├── package.json            # Dependências e scripts
├── scripts/
│   └── configure.js        # Script de configuração
├── config/
│   └── mcp-config.json     # Configuração MCP
└── README.md              # Esta documentação
```

### **Scripts Disponíveis**
```bash
# Desenvolvimento com reload automático
npm run dev

# Executar testes
npm run test

# Configuração interativa
npm run configure

# Instalação global
npm run install-global
```

### **Extensão da API**
Para adicionar novas funcionalidades:

1. **Adicione nova ferramenta** no método `setupHandlers()`
2. **Implemente o handler** correspondente
3. **Atualize a documentação** das ferramentas disponíveis

## 🚨 **Troubleshooting**

### **Erro de Autenticação**
```bash
# Verificar token
echo $CODACY_API_TOKEN

# Reconfigurar
npm run configure
```

### **Erro de Conexão**
```bash
# Testar conectividade
curl -H "api-token: $CODACY_API_TOKEN" \
  https://app.codacy.com/api/v3/projects/gh/gabrimachado147/sorriso-inteligente-app
```

### **Servidor MCP Não Responde**
```bash
# Verificar processo
ps aux | grep codacy-mcp-server

# Reiniciar servidor
npm start
```

## 📊 **Status do Projeto Sorriso Inteligente**

### **Configuração Atual**
- ✅ **API Token**: Configurado
- ✅ **Projeto**: `gh/gabrimachado147/sorriso-inteligente-app`
- ✅ **Coverage Upload**: Funcionando
- ✅ **Quality Analysis**: Ativo

### **Métricas Atuais**
- **Testes**: 42/44 passando (95.5%)
- **Coverage**: 41.96% statements
- **Quality Grade**: Monitorado via Codacy
- **Build Status**: ✅ Produção pronto

## 🔗 **Links Úteis**

- [Codacy API Docs](https://docs.codacy.com/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [Projeto no GitHub](https://github.com/gabrimachado147/sorriso-inteligente-app)

## 📄 **Licença**

MIT License - veja arquivo LICENSE para detalhes.

---

**Desenvolvido para o projeto Sorriso Inteligente PWA** 🦷✨
