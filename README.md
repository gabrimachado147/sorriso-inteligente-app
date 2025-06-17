# 🦷 Senhor Sorriso - Sistema de Agendamentos Odontológicos

[![.github/workflows/deploy.yml](https://github.com/gabrimachado147/sorriso-inteligente-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/gabrimachado147/sorriso-inteligente-app/actions/workflows/deploy.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/66018b405a664453ac8626dcae05bbdc)](https://app.codacy.com/gh/gabrimachado147/sorriso-inteligente-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Lighthouse CI](https://github.com/gabrimachado147/sorriso-inteligente-app/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/gabrimachado147/sorriso-inteligente-app/actions/workflows/lighthouse.yml)

Um Progressive Web App (PWA) moderno e completo para gerenciamento de consultas odontológicas, desenvolvido com React, TypeScript e Supabase.

## ✨ Funcionalidades Principais

### 🏥 Para Pacientes
- **Agendamento Online**: Interface intuitiva para marcar consultas
- **Avaliação Gratuita**: Primeira consulta sem custo
- **Histórico Completo**: Visualização de todas as consultas
- **Reagendamento**: Possibilidade de alterar data/horário das consultas
- **Cancelamento**: Cancelar consultas com justificativa
- **Chat IA Inteligente**: Assistente virtual especializado em odontologia
- **Localização de Clínicas**: Mapa interativo com todas as unidades
- **Emergências**: Informações de contato para urgências
- **Perfil Personalizado**: Dados pessoais e preferências

### 👨‍⚕️ Para Profissionais e Administração
- **Dashboard Completo**: Visão geral de agendamentos e estatísticas
- **Gerenciamento de Consultas**: Visualizar, editar e organizar agendamentos
- **Sistema de Status**: Controle de confirmados, cancelados, concluídos
- **Filtros Avançados**: Por clínica, data, status e paciente
- **Ações Administrativas**: Reagendar e cancelar consultas de clientes
- **Contato Direto**: Links para ligação e email do paciente
- **Relatórios**: Estatísticas detalhadas de atendimento

### 🏢 Clínicas Disponíveis
- **Campo Belo - MG**: Rua das Flores, 123
- **Formiga - MG**: Av. Brasil, 456  
- **Itararé - SP**: Rua São Pedro, 789
- **Capão Bonito - SP**: Praça da Matriz, 101
- **Itapeva - SP**: Av. Mário Covas, 321

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI/UX**: Tailwind CSS + Shadcn/UI + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Estado**: TanStack Query + Context API
- **Roteamento**: React Router DOM
- **PWA**: Service Workers + Manifest
- **Maps**: Google Maps API
- **Chat IA**: Base de conhecimento integrada
- **Acessibilidade**: WCAG 2.1 AA

## 🎯 Especialidades Atendidas

- Clínica Geral e Avaliação Gratuita
- Ortodontia e Alinhadores Invisíveis
- Implantodontia com Planejamento Digital
- Estética Dental (Clareamento, Facetas)
- Harmonização Orofacial
- Endodontia (Tratamento de Canal)
- Odontopediatria (3+ anos)
- Periodontia e Cirurgia
- Próteses Fixas e Móveis
- Urgências Odontológicas

## 📱 Características PWA

- ✅ **Instalável**: Pode ser instalado como app nativo
- ✅ **Offline Ready**: Funcionalidade básica sem internet
- ✅ **Responsivo**: Otimizado para mobile, tablet e desktop
- ✅ **Performance**: Carregamento rápido e otimizado
- ✅ **Push Notifications**: Lembretes de consultas
- ✅ **Sync em Background**: Sincronização automática

## 🔐 Sistema de Autenticação

- **Registro**: Email/senha com validação
- **Login**: Acesso seguro com sessão persistente
- **Recuperação**: Reset de senha via email
- **Perfis**: Diferenciação entre pacientes e staff
- **Segurança**: Row Level Security (RLS) no Supabase

## 🏗️ Arquitetura do Sistema

### 📊 Banco de Dados (Supabase)
```
📦 Tabelas Principais
├── 👤 user_profiles - Perfis de usuários
├── 🏥 appointments - Agendamentos
├── 🏢 clinics - Clínicas disponíveis
├── 🔗 user_appointments - Vínculos usuário-consulta
├── 📧 reminders - Sistema de lembretes
├── ⭐ reviews - Avaliações de atendimento
├── 📊 analytics_events - Métricas de uso
└── ⚙️ notification_preferences - Configurações
```

### 🎯 Funcionalidades Implementadas
- ✅ Integração completa com Supabase
- ✅ Sistema de autenticação robusto
- ✅ Agendamento e gestão de consultas
- ✅ Chat IA com base de conhecimento
- ✅ Dashboard administrativo
- ✅ Notificações e lembretes
- ✅ Sincronização em tempo real
- ✅ Sistema de avaliações
- ✅ Análise de métricas
- ✅ Modo offline básico

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# (As chaves do Supabase já estão configuradas)

# Execute o projeto
npm run dev
```

### Build para Produção
```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

## 📋 Horários de Atendimento

- **Segunda a Sexta**: 08h às 19h
- **Sábado**: 08h às 13h
- **Domingo**: Fechado
- **Emergências**: Contato disponível 24h

## 💳 Formas de Pagamento

- Cartão de Débito/Crédito
- PIX (7% desconto à vista)
- Parcelamento até 12x sem juros
- Convênios odontológicos selecionados
- Financiamento para implantes (até 24x)

## 🎨 Design System

- **Cores**: Paleta profissional azul/verde
- **Tipografia**: Inter font family
- **Componentes**: Shadcn/UI customizado
- **Responsividade**: Mobile-first approach
- **Acessibilidade**: Contraste adequado e navegação por teclado

## 📈 Próximas Melhorias

- [ ] Integração com calendário Google/Outlook
- [ ] Sistema de fidelidade e pontuação
- [ ] Telemedicina para consultas online
- [ ] Inteligência artificial para diagnóstico
- [ ] App móvel nativo (React Native)
- [ ] Sistema de pagamento integrado
- [ ] Envio de receitas digitais
- [ ] Histórico médico completo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 📞 Suporte

- **Email**: suporte@sorrisointeligente.com / suporte@senhorsorriso.com.br
- **Telefone**: (35) 3123-4567
- **WhatsApp**: (35) 99999-9999
- **GitHub Issues**: [Criar issue](https://github.com/gabrimachado147/sorriso-inteligente-app/issues)

## Integração com Supabase

O projeto utiliza Supabase para autenticação, banco de dados e realtime. A configuração está em `src/integrations/supabase/client.ts` e usa variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).

- Para acessar dados, use o client importando:
  ```ts
  import { supabase } from '@/integrations/supabase/client';
  ```
- Os serviços e hooks já usam o Supabase para CRUD de agendamentos, perfis, etc.
- Testes automatizados de integração estão em `tests/supabase.integration.test.ts` e rodam no CI.

Para onboarding:
- Peça acesso ao painel do Supabase.
- Configure as variáveis de ambiente no `.env` local.
- Rode `npm test` para validar integração localmente.

---

🦷 **Senhor Sorriso** - Cuidando do seu sorriso com tecnologia e carinho.
