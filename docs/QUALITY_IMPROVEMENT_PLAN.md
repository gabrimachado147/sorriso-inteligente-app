# 🔧 PHASE 3: QUALITY IMPROVEMENTS

## Plano para Melhorar Cobertura de Código e Testes

### 📊 **Estado Atual**
- **Testes**: 42/44 passing (95.5%)
- **Cobertura**: 41.96% statements, 37.36% branches
- **PWA Hook**: 60.84% coverage (boa)
- **Storage**: 17.68% coverage (precisa melhorar)

### 🎯 **Objetivos**
- Atingir 50%+ cobertura total
- Corrigir 2 testes falhando
- Melhorar cobertura do `offline-storage.ts`

---

## 1. **Correção dos Testes Falhando**

### Problema 1: Background Sync Status
```typescript
// tests/pwa-advanced-features.test.ts linha 98
expect(result.current.backgroundSyncStatus).toBe('failed');
// Atual: 'idle'
```

**Solução**: Corrigir lógica async/await no teste:
```typescript
test('should handle background sync failure gracefully', async () => {
  const { result } = renderHook(() => usePWA());
  
  // Mock do erro
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Sync failed'));
  
  // Aguardar conclusão
  await act(async () => {
    const success = await result.current.syncOfflineData();
    expect(success).toBe(false);
  });
  
  expect(result.current.backgroundSyncStatus).toBe('failed');
});
```

### Problema 2: Service Worker Updates
```typescript
// tests/pwa-advanced-features.test.ts linha 114
expect(result.current.updateAvailable).toBe(true);
// Atual: false
```

**Solução**: Aguardar atualização de estado:
```typescript
test('should detect service worker updates', async () => {
  const { result } = renderHook(() => usePWA());
  
  mockRegistration.waiting = { postMessage: jest.fn() };
  
  await act(async () => {
    await result.current.checkForUpdates();
  });
  
  // Aguardar próxima atualização
  await waitFor(() => {
    expect(result.current.updateAvailable).toBe(true);
    expect(result.current.hasUpdate).toBe(true);
  });
});
```

---

## 2. **Melhorar Cobertura do Offline Storage**

### Testes Adicionais Necessários
```typescript
// tests/offline-storage.test.ts (novo arquivo)
import { OfflineStorageManager } from '../src/lib/offline-storage';

describe('Offline Storage', () => {
  let storage: OfflineStorageManager;
  
  beforeEach(() => {
    storage = new OfflineStorageManager();
  });
  
  describe('Cache Operations', () => {
    test('should store and retrieve data', async () => {
      await storage.store('patients', 'test-id', { name: 'Test' });
      const data = await storage.get('patients', 'test-id');
      expect(data).toEqual({ name: 'Test' });
    });
    
    test('should handle cache misses', async () => {
      const data = await storage.get('patients', 'nonexistent');
      expect(data).toBeNull();
    });
  });
  
  describe('Sync Queue', () => {
    test('should add items to sync queue', async () => {
      await storage.addToSyncQueue({
        type: 'create',
        table: 'patients',
        data: { name: 'Test' }
      });
      
      const queue = await storage.getSyncQueue();
      expect(queue).toHaveLength(1);
    });
  });
  
  describe('Storage Management', () => {
    test('should calculate storage usage', async () => {
      const usage = await storage.getStorageUsage();
      expect(usage).toHaveProperty('used');
      expect(usage).toHaveProperty('quota');
    });
    
    test('should clear old data', async () => {
      await storage.clearOldData(Date.now() - 1000);
      // Verificar que dados antigos foram removidos
    });
  });
});
```

---

## 3. **Testes de Integração PWA**

### PWA End-to-End Tests
```typescript
// tests/pwa-integration.test.ts (novo arquivo)
describe('PWA Integration', () => {
  test('should work offline', async () => {
    // Simular offline
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(false);
    expect(result.current.backgroundSyncStatus).toBe('idle');
  });
  
  test('should sync when coming online', async () => {
    const { result } = renderHook(() => usePWA());
    
    // Simular volta online
    await act(async () => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));
    });
    
    await waitFor(() => {
      expect(result.current.backgroundSyncStatus).toBe('syncing');
    });
  });
});
```

---

## 4. **Comandos para Execução**

### Executar Melhorias
```bash
# Criar novos testes
npm run test:watch tests/offline-storage.test.ts

# Verificar cobertura específica
npm run test:coverage -- --collectCoverageFrom="src/lib/*.ts"

# Corrigir testes existentes
npm run test:watch tests/pwa-advanced-features.test.ts

# Rodar tudo
npm run test:coverage
```

### Metas de Cobertura
```javascript
// jest.config.js - atualizar thresholds
coverageThreshold: {
  global: {
    branches: 60,    // era 50
    functions: 60,   // era 50
    lines: 60,       // era 50
    statements: 60,  // era 50
  },
  'src/lib/offline-storage.ts': {
    branches: 40,
    functions: 40,
    lines: 40,
    statements: 40,
  }
}
```

---

## 5. **Cronograma de Execução**

### Immediate (15 min)
- ✅ Deploy em produção (FEITO)
- ⏳ Corrigir 2 testes falhando

### Short-term (30 min)
- ⏳ Criar testes para offline-storage
- ⏳ Aumentar cobertura para 50%+

### Medium-term (1 hora)
- ⏳ Testes de integração E2E
- ⏳ Performance testing
- ⏳ Accessibility testing

---

**Próxima Ação**: Escolher entre:
1. 🚀 **Deploy Imediato** (projeto já está pronto!)
2. 🔧 **Corrigir Testes** (melhorar qualidade)
3. ⚡ **Setup CI/CD** (automação)
