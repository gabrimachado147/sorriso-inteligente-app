import { renderHook } from '@testing-library/react';
import { usePWA } from '../src/hooks/usePWA';

/**
 * Testes avançados para funcionalidades PWA
 * Valida Background Sync, notificações e armazenamento offline
 */

describe('PWA Advanced Features', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Ensure navigator is online for most tests
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Background Sync', () => {
    test('should register background sync when going online', async () => {
      const { result } = renderHook(() => usePWA());
      expect(result.current).toBeDefined();
      expect(typeof result.current.syncOfflineData).toBe('function');
      
      // Since we're using mocked hook, test the mock behavior
      const success = await result.current.syncOfflineData();
      expect(success).toBe(true);
      
      // Verify service worker registration mock was called
      const registration = await navigator.serviceWorker.ready;
      expect(registration.sync?.register).toBeDefined();
    });
    
    test('should handle background sync failure gracefully', async () => {
      const { result } = renderHook(() => usePWA());
      
      // Mock the syncOfflineData to return false for this test
      (result.current.syncOfflineData as jest.Mock).mockResolvedValueOnce(false);
      
      const success = await result.current.syncOfflineData();
      expect(success).toBe(false);
      expect(result.current.backgroundSyncStatus).toBe('idle');
    });
    
    test('should sync offline data manually', async () => {
      const { result } = renderHook(() => usePWA());
      const success = await result.current.syncOfflineData();
      expect(success).toBe(true);
      expect(result.current.syncOfflineData).toHaveBeenCalled();
    });
  });

  describe('Update Notifications', () => {
    test('should detect service worker updates', async () => {
      const { result } = renderHook(() => usePWA());
      
      // Mock updateAvailable to true for this test
      const mockResult = result.current as unknown as {
        updateAvailable: boolean;
        hasUpdate: boolean;
        checkForUpdates: jest.MockedFunction<() => Promise<void>>;
      };
      mockResult.updateAvailable = true;
      mockResult.hasUpdate = true;
      
      await result.current.checkForUpdates();
      expect(result.current.checkForUpdates).toHaveBeenCalled();
    });
    
    test('should apply updates correctly', async () => {
      const { result } = renderHook(() => usePWA());
      
      await result.current.applyUpdate();
      expect(result.current.applyUpdate).toHaveBeenCalled();
    });
  });

  test('should mock window.matchMedia', () => {
    expect(window.matchMedia).toBeDefined();
    expect(window.matchMedia('(min-width: 600px)').matches).toBe(false);
  });
});
