
# Sorriso Inteligente App

Um aplicativo híbrido (desktop e mobile) para agendamento e gestão de consultas odontológicas, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Agendamento de Consultas**: Interface intuitiva para agendar consultas
- **Localização de Clínicas**: Busca e visualização de clínicas próximas
- **Chat Bot Inteligente**: Assistente virtual para orientações
- **Gestão de Consultas**: Histórico e controle de agendamentos
- **Sistema de Filtros**: Busca avançada por clínica, serviço e data
- **Feedback Visual**: Toasts, badges de status e animações

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **Estado**: TanStack Query
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Animações**: CSS Animations + Tailwind
- **Backend**: Supabase (planejado)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes de UI reutilizáveis
│   ├── Chat/            # Chat bot e mensagens
│   ├── Appointments/    # Agendamento de consultas
│   ├── Locations/       # Localização de clínicas
│   ├── Dashboard/       # Página inicial
│   └── Layout/          # Layout e navegação
├── lib/                 # Utilitários e configurações
├── hooks/               # Custom hooks
├── pages/               # Páginas principais
├── services/            # Serviços e API
└── integrations/        # Integrações externas (Supabase, etc.)
```

## 📚 Documentação

- **[Guia de Desenvolvimento](docs/development-guide.md)** - Setup, scripts e convenções
- **[Arquitetura](docs/architecture.md)** - Estrutura técnica e padrões
- **[API e Integrações](docs/api-integrations.md)** - Supabase, N8N, WhatsApp
- **[Ambiente de Staging](docs/staging-environment.md)** - Deploy e CI/CD
- **[Guia de Contribuição](CONTRIBUTING.md)** - Como contribuir com o projeto
- **[Changelog](CHANGELOG.md)** - Histórico de versões e mudanças
- **[AI Integration Blueprint](docs/ai-integration-blueprint.md)** - Visão geral das integrações de IA e plano de melhorias

## 🎨 Sistema de Design

### Animações Globais
- **Fade transitions**: Entrada/saída suave de elementos
- **Slide animations**: Transições direcionais
- **Scale effects**: Hover e focus states
- **Loading states**: Pulse e shimmer effects

### Componentes de Feedback
- **Toasts customizados**: Sucesso, erro, warning, info
- **Status badges**: Confirmado, pendente, cancelado, urgente
- **Modais de confirmação**: Agendamento, cancelamento, dados
- **Progress indicators**: Formulários multi-step

## 🔧 Development

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/gabrimachado147/sorriso-inteligente-app.git
cd sorriso-inteligente-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

### Available NPM Scripts

Adicione os seguintes scripts ao seu `package.json` para suporte completo aos ambientes:

```jsonc
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lighthouse": "lighthouse https://sorriso-inteligente-app.lovable.app --output html --output-path ./lighthouse-report.html",
    "type-check": "tsc --noEmit"
  }
}
```

## 🌍 Environment Variables

### Development (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENVIRONMENT=development
```

### Staging (.env.staging)
```bash
VITE_API_BASE_URL=https://staging-api.enigmabot.store
VITE_N8N_WEBHOOK_URL=https://n8nwebhook.enigmabot.store/webhook/631694e6-5e32-49a7-b4df-a58423be231f
VITE_EVOLUTION_API_URL=https://evo.enigmabot.store/message/sendText/ELARA
VITE_SUPABASE_URL=https://porzszsbobsvwezdbipc.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
VITE_ENVIRONMENT=staging
```

### Production (.env.production)
```bash
VITE_API_BASE_URL=https://api.sorrisointeligente.com
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
VITE_ENVIRONMENT=production
```

### Edge Config

Para utilizar o Edge Config da Vercel, defina a variável `EDGE_CONFIG` com a
Connection String do seu store e instale o pacote `@vercel/edge-config`:

```bash
npm install @vercel/edge-config
vercel env pull
```

Em seguida, é possível ler valores no código:

```ts
import { get } from '@vercel/edge-config'

const greeting = await get<string>('greeting')
```

### Hypertune Flags

Para habilitar feature flags com Hypertune, defina no seu `.env.local` as variáveis
`NEXT_PUBLIC_HYPERTUNE_TOKEN` e `EXPERIMENTATION_CONFIG_ITEM_KEY`. Também
configure o diretório de saída para os tipos gerados:

```bash
HYPERTUNE_FRAMEWORK=nextApp
HYPERTUNE_OUTPUT_DIRECTORY_PATH=src/generated
```

Com tudo configurado, instale as dependências e gere os tipos:

```bash
npm install flags @flags-sdk/hypertune hypertune server-only @vercel/edge-config
npx hypertune
```

O arquivo `src/flags.ts` expõe funções de flag prontas para uso no código.

### Statsig Flags

Para utilizar o adaptador do Statsig, defina as variáveis `NEXT_PUBLIC_STATSIG_CLIENT_KEY` e `STATSIG_SERVER_API_KEY` no `.env.local`.
Instale as dependências e sincronize o ambiente:

```bash
npm install flags @flags-sdk/statsig
vercel env pull
```

Em seguida, crie `src/statsigFlags.ts` conforme o exemplo abaixo:

```ts
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { flag, dedupe } from "flags/next";
import type { Identify } from "flags";

export const identify = dedupe(async () => ({ userID: "1234" })) satisfies Identify<StatsigUser>;

export const createFeatureFlag = (key: string) =>
  flag<boolean, StatsigUser>({
    key,
    adapter: statsigAdapter.featureGate((g) => g.value, { exposureLogging: true }),
    identify,
  });
```

### XAI / OpenAI

Defina `XAI_API_KEY` no ambiente e instale o SDK de sua preferência:

```bash
npm install openai @ai-sdk/xai ai
```

Exemplo de uso com o SDK OpenAI:

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

const completion = await client.chat.completions.create({
  model: 'grok-2-latest',
  messages: [
    { role: 'system', content: 'You are Grok...' },
    { role: 'user', content: 'What is the meaning of life?' },
  ],
});

console.log(completion.choices[0].message.content);
```

## 🚀 CI/CD

### Branch Strategy
- **main**: Produção estável
- **staging**: Ambiente de homologação
- **develop**: Desenvolvimento ativo
- **feature/***: Features em desenvolvimento

### Deploy Automático
- **Staging**: Auto-deploy no push para `staging`
- **Production**: Deploy manual via GitHub Actions

### GitHub Actions Workflows
- ✅ **staging.yml**: Deploy automático para staging
- 🔄 **production.yml**: Deploy para produção (planejado)
- 🧪 **test.yml**: Testes automatizados (planejado)

## 📱 Responsividade

O aplicativo é totalmente responsivo e otimizado para:
- **Desktop**: Layout com sidebar e navegação completa
- **Tablet**: Layout adaptativo com navegação simplificada
- **Mobile**: Bottom navigation e interface touch-friendly

## 🎯 Roadmap

### Sprint 2 - Semana 1 ✅
- [x] Animações e transições
- [x] Modais de confirmação
- [x] Skeleton loading aprimorado
- [x] Feedback visual (toasts/badges)
- [x] Sistema de filtros

### Sprint 2 - Semana 4 🔄
- [x] Branch staging configurada
- [x] Ambiente de staging
- [x] CI/CD inicial
- [ ] Testes automatizados

### Próximas Funcionalidades 📋
- [ ] Integração real com Supabase
- [ ] Sistema de autenticação
- [ ] Notificações push
- [ ] Modo offline
- [ ] Sincronização de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- **Email**: suporte@sorrisointeligente.com
- **GitHub Issues**: [Criar issue](https://github.com/gabrimachado147/sorriso-inteligente-app/issues)
