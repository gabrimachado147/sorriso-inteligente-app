# Guia de Desenvolvimento

## Primeiros Passos

### Pré-requisitos
- **Node.js** 18+ (recomendado: 20.x)
- **Bun** (gerenciador de pacotes preferido) ou npm/yarn
- **Git** para controle de versão
- **VS Code** (editor recomendado)

### Configuração Inicial

1. **Clone o repositório**
```bash
git clone https://github.com/gabrimachado147/sorriso-inteligente-app.git
cd sorriso-inteligente-app
```

2. **Instale as dependências**
```bash
# Com Bun (recomendado)
bun install

# Ou com npm
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo com suas configurações
code .env.local
```

4. **Inicie o servidor de desenvolvimento**
```bash
bun run dev
# ou
npm run dev
```

## Scripts Disponíveis

### Desenvolvimento
```bash
# Servidor de desenvolvimento
bun run dev

# Type checking
bun run type-check

# Linting
bun run lint
```

### Build
```bash
# Build para produção
bun run build

# Build para staging
bun run build:staging

# Preview do build
bun run preview
```

### Testes
```bash
# Certifique-se de instalar as dependências antes de rodar os testes
bun install
# ou
npm ci

# Executar testes
bun run test

# Testes em modo watch
bun run test:watch

# Testes com UI
bun run test:ui

# Cobertura de testes
bun run test:coverage
```

### Qualidade
```bash
# Audit de performance
bun run lighthouse

# Análise do bundle
bun run analyze
```

## Estrutura de Desenvolvimento

### Fluxo de Branches
```
main (produção)
├── staging (homologação)
├── develop (desenvolvimento)
└── feature/nome-da-feature
```

### Convenções de Commit
Usamos [Conventional Commits](https://conventionalcommits.org/):

```bash
# Formato
type(scope): description

# Exemplos
feat(auth): adiciona login com Google
fix(chat): corrige envio de mensagens
docs(readme): atualiza instruções de instalação
style(ui): melhora espaçamento dos botões
refactor(api): reorganiza serviços de API
test(hooks): adiciona testes para useAuth
```

### Tipos de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, sem mudança de lógica
- **refactor**: Refatoração de código
- **test**: Adicionar ou corrigir testes
- **chore**: Tarefas de manutenção

## Desenvolvimento de Componentes

### Estrutura de Componente
```typescript
// components/Feature/ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  // outras props...
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("base-classes", className)}>
      {/* conteúdo */}
    </div>
  );
};
```

### Boas Práticas
1. **Props tipadas**: Sempre criar interface para props
2. **className opcional**: Permitir customização de estilos
3. **Exports nomeados**: Preferir export nomeado ao export default
4. **Responsividade**: Mobile-first design
5. **Acessibilidade**: Usar atributos ARIA adequados

### Custom Hooks
```typescript
// hooks/useFeatureName.ts
import { useState, useEffect } from 'react';

interface UseFeatureNameReturn {
  data: DataType | null;
  loading: boolean;
  error: string | null;
}

export const useFeatureName = (): UseFeatureNameReturn => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // lógica do hook...

  return { data, loading, error };
};
```

## Estilização com Tailwind

### Classes Utilitárias
```tsx
// Exemplo de componente responsivo
<div className="
  flex flex-col space-y-4
  p-4 md:p-6 lg:p-8
  bg-white dark:bg-gray-900
  rounded-lg shadow-md
  max-w-sm md:max-w-md lg:max-w-lg
">
  <h2 className="text-xl md:text-2xl font-bold">
    Título
  </h2>
</div>
```

### Variáveis CSS Customizadas
```css
/* Definidas em src/index.css */
:root {
  --primary: 220 38% 57%;
  --secondary: 220 14% 96%;
  --accent: 220 14% 96%;
  --destructive: 0 84% 60%;
}
```

## Integrações

### Supabase
```typescript
// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Exemplo de uso
export const getAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

### TanStack Query
```typescript
// hooks/useAppointments.ts
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/services/supabase';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

## Testes

### Configuração
- **Vitest**: Framework de testes
- **Testing Library**: Utilitários para testes de componentes
- **jsdom**: Ambiente DOM para testes

### Exemplo de Teste
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

### Cobertura de Testes
```bash
# Executar com cobertura
bun run test:coverage

# Arquivos importantes para testar:
# - Custom hooks
# - Componentes complexos
# - Utilitários
# - Serviços de API
```

## Debug e Troubleshooting

### Logs de Debug
```typescript
// Configuração de logs baseada no ambiente
const isDev = import.meta.env.VITE_ENVIRONMENT === 'development';

const logger = {
  debug: (message: string, data?: any) => {
    if (isDev) console.log(`🐛 ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  },
};
```

### Problemas Comuns

1. **Erro de build TypeScript**
   ```bash
   # Verificar tipos
   bun run type-check
   
   # Limpar cache do TypeScript
   rm -rf node_modules/.cache
   ```

2. **Problemas com Tailwind**
   ```bash
   # Verificar se as classes estão sendo detectadas
   # Checar tailwind.config.ts e purge settings
   ```

3. **Variáveis de ambiente não carregam**
   ```bash
   # Verificar se começam com VITE_
   # Reiniciar o servidor de desenvolvimento
   ```

## Performance

### Bundle Analysis
```bash
# Analisar tamanho do bundle
bun run build -- --analyze

# Verificar dependências grandes
npx bundlephobia <package-name>
```

### Otimizações
1. **Lazy Loading**: Carregar componentes sob demanda
2. **Memoização**: React.memo para componentes pesados
3. **Debounce**: Para inputs de busca
4. **Virtual Lists**: Para listas grandes

### Lighthouse
```bash
# Audit de performance
bun run lighthouse

# Métricas importantes:
# - First Contentful Paint < 1.8s
# - Largest Contentful Paint < 2.5s
# - Cumulative Layout Shift < 0.1
```

## VS Code Setup

### Extensões Recomendadas
- **TypeScript**: Suporte oficial
- **Tailwind CSS IntelliSense**: Autocomplete Tailwind
- **ES7+ React/Redux/React-Native snippets**: Snippets úteis
- **Prettier**: Formatação de código
- **GitLens**: Melhor integração Git
- **Auto Rename Tag**: Sincronizar tags HTML

### Configurações
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Deploy

### Staging
```bash
# Push para staging (auto-deploy)
git push origin staging
```

### Production
```bash
# Criar PR para main
# Após aprovação, merge ativa deploy automático
```

### Verificações Pré-Deploy
- [ ] Testes passando
- [ ] Type check sem erros
- [ ] Build successful
- [ ] Performance audit OK
- [ ] Variáveis de ambiente configuradas
