# Guia de Contribuição

Obrigado por considerar contribuir com o **Sorriso Inteligente App**! 🦷

## Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/sorriso-inteligente-app.git
cd sorriso-inteligente-app

# Adicione o repositório original como upstream
git remote add upstream https://github.com/gabrimachado147/sorriso-inteligente-app.git
```

### 2. Configuração do Ambiente
```bash
# Instale as dependências
bun install

# Copie e configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
bun run dev
```

### 3. Criando uma Branch
```bash
# Sempre crie uma branch a partir de develop
git checkout develop
git pull upstream develop

# Crie uma nova branch
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b fix/nome-do-bug
```

## Tipos de Contribuição

### 🐛 Reportar Bugs
- Use o template de issue para bugs
- Inclua steps para reproduzir
- Adicione screenshots quando relevante
- Especifique browser/SO/versão

### ✨ Solicitar Funcionalidades
- Use o template de feature request
- Descreva o problema que resolve
- Proponha uma solução
- Considere implementações alternativas

### 💻 Contribuições de Código
- Siga as convenções de código
- Adicione testes quando necessário
- Atualize a documentação
- Mantenha commits pequenos e focados

### 📚 Documentação
- Corrigir typos
- Melhorar explicações
- Adicionar exemplos
- Traduzir conteúdo

## Convenções de Código

### TypeScript
```typescript
// ✅ Bom
interface UserProps {
  name: string;
  email?: string;
}

const UserCard: React.FC<UserProps> = ({ name, email }) => {
  return <div className="user-card">{name}</div>;
};

// ❌ Evitar
const UserCard = (props: any) => {
  return <div>{props.name}</div>;
};
```

### React Components
```typescript
// ✅ Estrutura recomendada
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {children}
    </div>
  );
};
```

### CSS/Tailwind
```tsx
// ✅ Responsivo e semântico
<div className="
  flex flex-col space-y-4
  p-4 md:p-6 lg:p-8
  bg-white dark:bg-gray-900
  rounded-lg shadow-md
  max-w-sm md:max-w-md lg:max-w-lg
">

// ❌ Muito específico ou não responsivo
<div className="p-4 bg-white rounded-lg w-320">
```

### Commits
Use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Formato
type(scope): description

# Exemplos
feat(auth): adiciona login com Google OAuth
fix(chat): corrige envio de mensagens em mobile
docs(readme): atualiza instruções de instalação
style(ui): melhora espaçamento dos cards
refactor(api): reorganiza serviços do Supabase
test(hooks): adiciona testes para useAuth hook
chore(deps): atualiza dependências do projeto
```

#### Tipos de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Apenas documentação
- **style**: Formatação, sem mudança de lógica
- **refactor**: Refatoração de código
- **test**: Adicionar ou corrigir testes
- **chore**: Tarefas de manutenção

#### Scopes Comuns
- **auth**: Autenticação e autorização
- **ui**: Componentes de interface
- **api**: Serviços e integrações
- **chat**: Sistema de chat
- **booking**: Agendamento
- **clinics**: Gestão de clínicas
- **mobile**: Funcionalidades específicas mobile

## Pull Request

### Antes de Abrir o PR
- [ ] Código segue as convenções
- [ ] Testes passam (`bun run test`)
- [ ] Build funciona (`bun run build`)
- [ ] Type check OK (`bun run type-check`)
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado

### Template de PR
```markdown
## Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (correção ou funcionalidade que quebra compatibilidade)
- [ ] Documentação

## Descrição
Descreva suas mudanças de forma clara e concisa.

## Como Testar
Passos para testar as mudanças:
1. ...
2. ...

## Screenshots
Se relevante, adicione screenshots das mudanças.

## Checklist
- [ ] Código segue as convenções do projeto
- [ ] Self-review do código realizado
- [ ] Comentários adicionados em código complexo
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] CHANGELOG.md atualizado
```

## Revisão de Código

### Como Revisor
- Seja construtivo e respeitoso
- Foque na lógica e padrões
- Sugira melhorias quando possível
- Approve quando estiver satisfeito

### Recebendo Review
- Responda a comentários prontamente
- Faça mudanças solicitadas
- Explique decisões quando necessário
- Agradeça feedback construtivo

## Configuração de Desenvolvimento

### VS Code Extensions
Instale as extensões recomendadas:
```bash
# Via command palette (Ctrl+Shift+P)
Extensions: Show Recommended Extensions
```

### Configurações
```json
// .vscode/settings.json (já configurado)
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Testes

### Executando Testes
```bash
# Todos os testes
bun run test

# Modo watch
bun run test:watch

# Com cobertura
bun run test:coverage

# Specific file
bun run test src/components/ui/button.test.tsx
```

### Escrevendo Testes
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Issues e Bug Reports

### Template de Bug Report
```markdown
**Descreva o bug**
Uma descrição clara e concisa do bug.

**Para Reproduzir**
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição clara do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Desktop (complete as informações):**
 - OS: [e.g. macOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (complete as informações):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Contexto Adicional**
Qualquer outro contexto sobre o problema.
```

### Template de Feature Request
```markdown
**A feature está relacionada a um problema? Descreva.**
Uma descrição clara e concisa do problema.

**Descreva a solução que você gostaria**
Uma descrição clara e concisa do que você quer que aconteça.

**Descreva alternativas que você considerou**
Uma descrição clara e concisa de soluções ou features alternativas.

**Contexto Adicional**
Qualquer outro contexto ou screenshots sobre a feature request.
```

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

## Código de Conduta

### Nosso Compromisso
Nos comprometemos a tornar a participação em nosso projeto uma experiência livre de assédio para todos.

### Padrões
Exemplos de comportamento que contribuem para criar um ambiente positivo:

- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista e experiências
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

### Responsabilidades
Os mantenedores do projeto são responsáveis por esclarecer os padrões de comportamento aceitável.

## Dúvidas?

- 📧 Email: suporte@sorrisointeligente.com
- 💬 Discord: [Link do servidor]
- 🐛 Issues: [GitHub Issues](https://github.com/gabrimachado147/sorriso-inteligente-app/issues)

Obrigado por contribuir! 🚀
