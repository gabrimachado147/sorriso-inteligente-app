import { renderHook } from '@testing-library/react';
import { usePWA } from '../src/hooks/usePWA';

/**
 * Testes avançados para funcionalidades PWA
 * Valida Background Sync, notificações e armazenamento offline
 */

interface MockServiceWorkerRegistration {
  sync: {
    register: jest.Mock;
  };
  waiting: { postMessage: jest.Mock } | null;
  update: jest.Mock;
  showNotification: jest.Mock;
}

interface MockServiceWorkerContainer {
  ready: Promise<MockServiceWorkerRegistration>;
  register: jest.Mock;
  getRegistration: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
}

describe('PWA Advanced Features', () => {
  let mockServiceWorker: MockServiceWorkerContainer;
  let mockRegistration: MockServiceWorkerRegistration;

  beforeEach(() => {
    // Mock Service Worker APIs
    mockRegistration = {
      sync: {
        register: jest.fn(() => Promise.resolve())
      },
      waiting: null,
      update: jest.fn(() => Promise.resolve()),
      showNotification: jest.fn(() => Promise.resolve())
    };

    mockServiceWorker = {
      ready: Promise.resolve(mockRegistration),
      register: jest.fn(() => Promise.resolve(mockRegistration)),
      getRegistration: jest.fn(() => Promise.resolve(mockRegistration)),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      configurable: true
    });
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true
    });
    global.indexedDB = {
      open: jest.fn(() => ({
        result: {
          createObjectStore: jest.fn(),
          transaction: jest.fn(() => ({
            objectStore: jest.fn(() => ({
              getAll: jest.fn(() => ({ result: [] })),
              put: jest.fn(),
              delete: jest.fn(),
              clear: jest.fn()
            }))
          })),
          objectStoreNames: {
            contains: jest.fn(() => true)
          }
        },
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null
      }))
    };
    Object.defineProperty(navigator, 'storage', {
      value: {
        estimate: jest.fn(() => Promise.resolve({
          usage: 1024 * 1024,
          quota: 100 * 1024 * 1024
        }))
      },
      configurable: true
    });
    global.window.gtag = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Background Sync', () => {
    test('should register background sync when going online', async () => {
      const { result } = renderHook(() => usePWA());
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-appointments');
    });
    test('should handle background sync failure gracefully', async () => {
      mockRegistration.sync.register.mockRejectedValue(new Error('Sync failed'));
      const { result } = renderHook(() => usePWA());
      const success = await result.current.syncOfflineData();
      expect(success).toBe(false);
      expect(result.current.backgroundSyncStatus).toBe('failed');
    });
    test('should sync offline data manually', async () => {
      const { result } = renderHook(() => usePWA());
      const success = await result.current.syncOfflineData();
      expect(success).toBe(true);
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-appointments');
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-chat');
    });
  });

  describe('Update Notifications', () => {
    test('should detect service worker updates', async () => {
      const { result } = renderHook(() => usePWA());
      mockRegistration.waiting = { postMessage: jest.fn() };
      await result.current.checkForUpdates();
      expect(result.current.updateAvailable).toBe(true);
      expect(result.current.hasUpdate).toBe(true);
    });
    test('should apply updates correctly', async () => {
      const { result } = renderHook(() => usePWA());
      mockRegistration.waiting = { postMessage: jest.fn() };
      await result.current.applyUpdate();
      expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    });
  });
});
