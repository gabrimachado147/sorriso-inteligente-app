/**
 * Testes avançados para funcionalidades PWA
 * Valida Background Sync, notificações e armazenamento offline
 */

describe('PWA Advanced Features', () => {
  let mockServiceWorker;
  let mockRegistration;

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

    // Mock navigator APIs
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      configurable: true
    });

    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true
    });

    // Mock IndexedDB
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

    // Mock storage estimate
    Object.defineProperty(navigator, 'storage', {
      value: {
        estimate: jest.fn(() => Promise.resolve({
          usage: 1024 * 1024, // 1MB
          quota: 100 * 1024 * 1024 // 100MB
        }))
      },
      configurable: true
    });

    // Mock gtag for analytics
    global.window.gtag = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Background Sync', () => {
    test('should register background sync when going online', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Simulate going online
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-appointments');
    });

    test('should handle background sync failure gracefully', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      // Mock sync failure
      mockRegistration.sync.register.mockRejectedValue(new Error('Sync failed'));

      const { result } = renderHook(() => usePWA());

      const success = await result.current.syncOfflineData();
      expect(success).toBe(false);
      expect(result.current.backgroundSyncStatus).toBe('failed');
    });

    test('should sync offline data manually', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      const success = await result.current.syncOfflineData();
      expect(success).toBe(true);
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-appointments');
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('background-sync-chat');
    });
  });

  describe('Update Notifications', () => {
    test('should detect service worker updates', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Mock waiting service worker
      mockRegistration.waiting = {
        postMessage: jest.fn()
      };

      await result.current.checkForUpdates();

      expect(result.current.updateAvailable).toBe(true);
      expect(result.current.hasUpdate).toBe(true);
    });

    test('should apply updates correctly', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Mock waiting service worker
      mockRegistration.waiting = {
        postMessage: jest.fn()
      };

      await result.current.applyUpdate();

      expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({
        type: 'SKIP_WAITING'
      });
    });

    test('should track update events with analytics', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      await result.current.checkForUpdates();

      expect(global.window.gtag).toHaveBeenCalledWith('event', 'pwa_update_check', {
        event_category: 'PWA',
        event_label: 'Manual Update Check',
        value: 0
      });
    });
  });

  describe('Offline Storage', () => {
    test('should get storage usage', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      const usage = await result.current.getStorageUsage();

      expect(usage).toEqual({
        used: 1024 * 1024,
        quota: 100 * 1024 * 1024,
        percentage: 1
      });
    });

    test('should clear offline data', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      const success = await result.current.clearOfflineData();
      expect(success).toBe(true);
    });

    test('should handle storage errors gracefully', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      // Mock storage error
      navigator.storage.estimate.mockRejectedValue(new Error('Storage unavailable'));

      const { result } = renderHook(() => usePWA());

      const usage = await result.current.getStorageUsage();
      expect(usage).toEqual({ used: 0, quota: 0, percentage: 0 });
    });
  });

  describe('Installation Metrics', () => {
    test('should track install prompt shown', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Simulate beforeinstallprompt event
      const mockPromptEvent = {
        preventDefault: jest.fn(),
        prompt: jest.fn(() => Promise.resolve()),
        userChoice: Promise.resolve({ outcome: 'accepted' })
      };

      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockPromptEvent));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.installMetrics.installPromptShown).toBeGreaterThan(0);
      expect(global.window.gtag).toHaveBeenCalledWith('event', 'pwa_install_prompt_shown', {
        event_category: 'PWA',
        event_label: 'Install Prompt Available'
      });
    });

    test('should track successful installation', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Simulate app installed event
      window.dispatchEvent(new Event('appinstalled'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.isInstalled).toBe(true);
      expect(global.window.gtag).toHaveBeenCalledWith('event', 'pwa_installed', {
        event_category: 'PWA',
        event_label: 'App Installation Success'
      });
    });

    test('should get comprehensive metrics', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      const metrics = await result.current.getMetrics();

      expect(metrics).toHaveProperty('install');
      expect(metrics).toHaveProperty('storage');
      expect(metrics).toHaveProperty('online');
      expect(metrics).toHaveProperty('installed');
      expect(metrics).toHaveProperty('standalone');
      expect(metrics).toHaveProperty('updateAvailable');
      expect(metrics).toHaveProperty('backgroundSyncStatus');
    });
  });

  describe('Network Status', () => {
    test('should handle offline status', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      window.dispatchEvent(new Event('offline'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.isOnline).toBe(false);
    });

    test('should prevent sync when offline', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      // Set offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

      const { result } = renderHook(() => usePWA());

      const success = await result.current.syncOfflineData();
      expect(success).toBe(false);
    });
  });

  describe('Service Worker Integration', () => {
    test('should handle service worker messages', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      const { result } = renderHook(() => usePWA());

      // Simulate sync complete message
      const mockEvent = {
        data: {
          type: 'SYNC_COMPLETE',
          data: { type: 'appointments', count: 5 }
        }
      };

      // Trigger message event
      const messageHandler = mockServiceWorker.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1];

      if (messageHandler) {
        messageHandler(mockEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.backgroundSyncStatus).toBe('idle');
    });

    test('should register service worker event listeners', async () => {
      const { renderHook } = await import('@testing-library/react-hooks');
      const { usePWA } = await import('../src/hooks/usePWA');

      renderHook(() => usePWA());

      expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('controllerchange', expect.any(Function));
    });
  });
});

// Mock console to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
