# Arquitetura do Projeto

## Visão Geral

O **Sorriso Inteligente App** é um aplicativo híbrido (desktop e mobile) desenvolvido com React, TypeScript e Tailwind CSS para gestão de consultas odontológicas. O projeto segue uma arquitetura modular e escalável.

## Stack Tecnológica

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes
- **React Router DOM** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Lucide React** - Ícones

### Backend & Infraestrutura
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Banco de dados (via Supabase)
- **N8N** - Automação de workflows
- **Evolution API** - Integração WhatsApp Business

## Estrutura de Pastas

```
src/
├── components/          # Componentes React organizados por funcionalidade
│   ├── ui/             # Componentes de UI reutilizáveis (shadcn/ui)
│   ├── Chat/           # Sistema de chat bot
│   ├── Appointments/   # Agendamento de consultas
│   ├── Locations/      # Busca e localização de clínicas
│   ├── Dashboard/      # Página inicial e dashboard
│   └── Layout/         # Componentes de layout (header, nav, etc.)
├── pages/              # Páginas principais da aplicação
├── hooks/              # Custom React hooks
├── services/           # Serviços e integrações de API
├── lib/                # Utilitários e configurações
└── integrations/       # Integrações externas (Supabase, etc.)
```

## Componentes Principais

### 1. Sistema de Agendamento
- **AppointmentScheduler**: Componente principal de agendamento
- **useAppointmentScheduler**: Hook para lógica de agendamento
- Formulários multi-step com validação
- Integração com calendário

### 2. Sistema de Chat
- **ChatBot**: Interface do chat inteligente
- **useChatHandler**: Hook para mensagens e respostas
- Integração com N8N para automação
- Suporte a WhatsApp Business

### 3. Localização de Clínicas
- **LocationsPage**: Busca e filtros de clínicas
- Sistema de filtros avançado
- Integração com mapas (planejado)
- Geolocalização

### 4. Sistema de UI
- Componentes baseados em shadcn/ui
- Design system consistente
- Responsividade mobile-first
- Animações e transições suaves

## Fluxo de Dados

### 1. Estado Local
- React hooks (useState, useEffect)
- Context API para estado global
- Custom hooks para lógica reutilizável

### 2. Estado Servidor
- TanStack Query para cache e sincronização
- Supabase para persistência de dados
- Real-time subscriptions (planejado)

### 3. Integrações Externas
- **N8N**: Automação de workflows e notificações
- **Evolution API**: Comunicação WhatsApp
- **Supabase**: Banco de dados e autenticação

## Roteamento

```typescript
Routes:
├── / (Index)           # Página inicial/dashboard
├── /chat               # Chat bot
├── /schedule           # Agendamento
├── /clinics            # Busca de clínicas
├── /emergency          # Emergências
├── /profile            # Perfil do usuário
└── /404               # Página não encontrada
```

## Responsividade

### Breakpoints
- **Mobile**: < 768px - Bottom navigation
- **Tablet**: 768px - 1024px - Layout adaptativo
- **Desktop**: > 1024px - Sidebar navigation

### Estratégia Mobile-First
1. Design inicial para mobile
2. Progressive enhancement para telas maiores
3. Touch-friendly interfaces
4. Otimização de performance

## Autenticação e Segurança

### Supabase Auth (Implementação Futura)
- Autenticação por email/senha
- OAuth providers (Google, Facebook)
- Row Level Security (RLS)
- JWT tokens

### Variáveis de Ambiente
- Separação por ambiente (dev, staging, prod)
- Secrets management
- Validação de configuração

## Performance

### Otimizações
- **Code Splitting**: Lazy loading de rotas
- **Tree Shaking**: Eliminação de código não usado
- **Bundle Optimization**: Vite otimizações
- **Image Optimization**: WebP, lazy loading

### Monitoramento
- Lighthouse CI para auditoria
- Core Web Vitals tracking
- Error reporting (Sentry planejado)

## Testes

### Estratégia de Testes
- **Unit Tests**: Vitest para componentes e hooks
- **Integration Tests**: Testing Library
- **E2E Tests**: Cypress (planejado)
- **Visual Tests**: Chromatic (planejado)

### Cobertura
- Componentes críticos (agendamento, chat)
- Custom hooks
- Utilitários e helpers

## Deploy e CI/CD

### Ambientes
- **Development**: Local development
- **Staging**: Testes finais (staging.sorrisointeligente.com)
- **Production**: Versão estável (sorrisointeligente.com)

### Pipeline
1. **Push to branch** → Tests + Type check
2. **PR to staging** → Deploy preview
3. **Merge to staging** → Auto deploy staging
4. **PR to main** → Manual review
5. **Merge to main** → Production deploy

## Roadmap Técnico

### Sprint Atual
- [x] Estrutura base do projeto
- [x] Sistema de componentes UI
- [x] Roteamento e navegação
- [x] Mock data e protótipos

### Próximos Sprints
- [ ] Integração Supabase real
- [ ] Sistema de autenticação
- [ ] Testes automatizados
- [ ] PWA capabilities
- [ ] Notificações push

### Futuras Melhorias
- [ ] Modo offline
- [ ] Sincronização de dados
- [ ] Geolocalização e mapas
- [ ] Analytics avançado
- [ ] Multi-tenancy para clínicas

## Convenções de Código

### TypeScript
- Interfaces para tipos complexos
- Strict mode habilitado
- Prefer readonly quando possível

### React
- Functional components com hooks
- Props interfaces exportadas
- Custom hooks para lógica reutilizável

### CSS/Tailwind
- Utility-first approach
- Responsive design classes
- CSS variables para temas

### Commits
- Conventional commits
- Scope por funcionalidade
- Mensagens em português
