
export const quickPrompts = [
  {
    title: 'Análise de Arquitetura',
    prompt: 'Analise a arquitetura completa do projeto Sorriso Inteligente, incluindo estrutura de componentes React, hooks personalizados, integração com Supabase e padrões de design utilizados. Forneça um código de exemplo completo para otimização de performance usando React.memo, useMemo e useCallback. Inclua também exemplos de políticas RLS no Supabase, configuração de real-time subscriptions e implementação de edge functions. Detalhe a estrutura de pastas, convenções de nomenclatura e melhores práticas para manutenção do código. Adicione exemplos completos de testes unitários com Jest e Testing Library.'
  },
  {
    title: 'Otimização de Performance',
    prompt: 'Sugira melhorias específicas de performance para esta aplicação React com TypeScript, incluindo lazy loading, code splitting, memoization, otimizações do Supabase e PWA. Forneça código completo para implementar: 1) Lazy loading de componentes com React.lazy e Suspense, 2) Implementação de service worker para cache offline, 3) Otimização de queries do Supabase com índices e filtros, 4) Implementação de virtual scrolling para listas grandes, 5) Configuração de webpack para bundle splitting, 6) Implementação de prefetching de dados críticos, 7) Otimização de imagens com loading lazy e formatos modernos.'
  },
  {
    title: 'Melhores Práticas TypeScript',
    prompt: 'Revise o uso de TypeScript no projeto e sugira melhorias nos tipos, interfaces e padrões de tipagem. Forneça exemplos completos de: 1) Tipos utilitários avançados (Pick, Omit, Partial, Record), 2) Generics para componentes reutilizáveis, 3) Discriminated unions para estados complexos, 4) Tipagem estrita para props de componentes, 5) Tipos para APIs do Supabase com geração automática, 6) Implementação de type guards e assertion functions, 7) Configuração avançada do tsconfig.json para strict mode, 8) Tipagem de custom hooks com retorno complexo.'
  },
  {
    title: 'Integração Supabase Avançada',
    prompt: 'Como posso otimizar o uso do Supabase neste projeto? Inclua exemplos completos de: 1) Queries otimizadas com joins e filtros complexos, 2) Políticas RLS avançadas para diferentes níveis de usuário, 3) Edge functions para processamento server-side, 4) Real-time subscriptions para atualizações instantâneas, 5) Storage para upload de arquivos com resize automático, 6) Triggers de banco para automação, 7) Backup e migração de dados, 8) Monitoring e logging avançado, 9) Implementação de full-text search, 10) Configuração de webhooks para integrações externas.'
  },
  {
    title: 'Segurança e Autenticação',
    prompt: 'Identifique possíveis problemas de segurança no código e no banco de dados. Forneça exemplos completos de: 1) Políticas RLS para proteger dados sensíveis, 2) Validação de entrada com Zod schemas, 3) Sanitização de dados para prevenir XSS, 4) Implementação de rate limiting, 5) Configuração de CORS adequada, 6) Criptografia de dados sensíveis, 7) Auditoria de ações de usuário, 8) Implementação de 2FA, 9) Gestão segura de tokens JWT, 10) Práticas de segurança para PWA incluindo CSP headers.'
  },
  {
    title: 'PWA e Performance Mobile',
    prompt: 'Como melhorar a experiência PWA e performance mobile? Inclua código completo para: 1) Service worker avançado com estratégias de cache personalizadas, 2) App manifest otimizado com ícones adaptativos, 3) Implementação de background sync, 4) Push notifications com Supabase, 5) Otimização para devices com pouca memória, 6) Implementação de offline-first architecture, 7) Lazy loading de imagens responsivas, 8) Otimização de bundle size para mobile, 9) Implementação de install prompt customizado, 10) Performance metrics e monitoring em tempo real.'
  },
  {
    title: 'Testes e Qualidade',
    prompt: 'Implemente uma estratégia completa de testes para o projeto. Forneça código completo para: 1) Testes unitários com Jest e Testing Library, 2) Testes de integração com Supabase usando test database, 3) Testes end-to-end com Playwright, 4) Testes de performance com Lighthouse CI, 5) Testes de acessibilidade automatizados, 6) Mock strategies para APIs externas, 7) Setup de CI/CD com GitHub Actions, 8) Code coverage e quality gates, 9) Visual regression testing, 10) Load testing para endpoints críticos.'
  },
  {
    title: 'Arquitetura e Escalabilidade',
    prompt: 'Projete uma arquitetura escalável para o Sorriso Inteligente. Inclua código completo para: 1) Implementação de micro-frontends com Module Federation, 2) State management avançado com Zustand ou Context API, 3) Padrão de design system com Storybook, 4) Implementação de feature flags, 5) Monorepo setup com Nx ou Lerna, 6) API versioning estratégias, 7) Database sharding e partitioning no Supabase, 8) CDN setup para assets estáticos, 9) Monitoring e alerting com Sentry, 10) Deployment strategies com blue-green deployment.'
  }
];
