# AGENTS.md
## Visão geral
Aplicativo PWA “Sorriso Inteligente” para gestão de consultas odontológicas.

## Principais domínios
- Auth & usuários (Supabase)
- Clínicas (`clinics`)
- Serviços (`services`)
- Agendamentos (`appointments`)
- Pontos de fidelidade (`loyalty_points`)
- Chatbot (OpenAI, Grok)

## Fluxos críticos
1. Login/Signup → rota protegida
2. Agendar consulta → verificar disponibilidade (RPC) → criar `appointment`
3. Reagendar/Cancelar → update `status`
4. Trigger points quando `status = completed`
5. Chatbot consulta próximas consultas + saldo pontos
6. Offline queue + background sync (service worker)

## Guidelines para PR review
- Não usar `any` (eslint rule)
- Testes vitest 100 %
- CI exige `pnpm type-check`, `pnpm lint`, `pnpm test`
- Migrações Supabase **sempre** em `supabase/migrations/*.sql` com timestamp

## Deploy
- Preview: branch `staging` + Supabase dev
- Prod: merge em `main`, depois `supabase db push --project-ref $SUPABASE_PROD_REF`
