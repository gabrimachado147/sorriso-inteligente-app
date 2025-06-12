# 🚀 DEPLOY AUTOMATION - GitHub Actions CI/CD

## Configuração Completa para Automação de Deploy

### 1. **GitHub Actions Workflow**

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: 🚀 Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  CODACY_API_TOKEN: ${{ secrets.CODACY_API_TOKEN }}
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

jobs:
  quality-checks:
    name: ✅ Quality Checks
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 📦 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: 📋 Install Dependencies
      run: npm ci
      
    - name: 🔍 Type Check
      run: npm run type-check
      
    - name: 🧹 Lint Check
      run: npm run lint
      
    - name: 🧪 Run Tests
      run: npm run test:coverage
      
    - name: 📊 Upload Coverage to Codacy
      run: npm run coverage:upload
      if: github.ref == 'refs/heads/main'

  build-and-deploy:
    name: 🏗️ Build & Deploy
    runs-on: ubuntu-latest
    needs: quality-checks
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 📦 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: 📋 Install Dependencies
      run: npm ci
      
    - name: 🏗️ Build Project
      run: npm run build
      
    - name: 🚀 Deploy to Netlify
      uses: nwtgck/actions-netlify@v3.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: false
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        
    - name: 📈 Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        configPath: './.lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true
```

### 2. **Lighthouse Configuration**

Crie `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run preview",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.8}],
        "categories:seo": ["warn", {"minScore": 0.8}],
        "categories:pwa": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 3. **Secrets a Configurar no GitHub**

No repositório GitHub, vá em **Settings > Secrets and variables > Actions**:

```bash
# Codacy
CODACY_API_TOKEN=eJzda2H97ZUpnBA47FNt

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Netlify (opcional se usar Netlify)
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id
```

### 4. **Scripts Adicionais**

Adicione ao `package.json`:

```json
{
  "scripts": {
    "ci:quality": "npm run type-check && npm run lint && npm run test:coverage",
    "ci:build": "npm run build && npm run lighthouse",
    "ci:deploy": "npm run ci:quality && npm run ci:build",
    "preview:ci": "vite preview --port 3000 --host"
  }
}
```

### 5. **Deploy Manual Imediato**

Para deploy imediato sem CI/CD:

```bash
# Netlify
npm install -g netlify-cli
netlify login
netlify init
npm run build
netlify deploy --prod --dir=dist

# Vercel
npm install -g vercel
vercel login
vercel --prod

# GitHub Pages
npm run build
# Fazer commit do dist/ (se configurado)
```

## 🎯 **Próximos Passos**

1. **✅ AGORA**: Deploy manual imediato
2. **⚡ DEPOIS**: Configurar GitHub Actions
3. **📊 FUTURO**: Monitoramento avançado

---

**Status**: ✅ Pronto para implementar
**Tempo estimado**: 30 minutos para CI/CD completo
