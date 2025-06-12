[![Codacy Badge](https://app.codacy.com/project/badge/Grade/66018b405a664453ac8626dcae05bbdc)](https://app.codacy.com/gh/gabrimachado147/sorriso-inteligente-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/66018b405a664453ac8626dcae05bbdc)](https://app.codacy.com/gh/gabrimachado147/sorriso-inteligente-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

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
