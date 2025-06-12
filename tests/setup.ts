// Jest setup file
import '@testing-library/jest-dom';

// Mock IntersectionObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
  root = null;
  rootMargin = '';
  thresholds = [];
};

// Mock ResizeObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
global.window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock process.env
process.env.NODE_ENV = 'test';

// Mock Service Worker API
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    ready: Promise.resolve({
      sync: {
        register: jest.fn(() => Promise.resolve()),
      },
      waiting: null,
      active: true,
      installing: null,
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
    register: jest.fn(() => Promise.resolve({
      sync: {
        register: jest.fn(() => Promise.resolve()),
      },
      waiting: null,
      active: true,
      installing: null,
      update: jest.fn(() => Promise.resolve()),
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
    getRegistration: jest.fn(() => Promise.resolve({
      sync: {
        register: jest.fn(() => Promise.resolve()),
      },
      waiting: null,
      active: true,
      installing: null,
      update: jest.fn(() => Promise.resolve()),
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  configurable: true,
});

// Mock Navigator online status
Object.defineProperty(navigator, 'onLine', {
  value: true,
  configurable: true,
});

// Mock Navigator storage
Object.defineProperty(navigator, 'storage', {
  value: {
    estimate: jest.fn(() => Promise.resolve({
      usage: 1024 * 1024,
      quota: 100 * 1024 * 1024,
    })),
  },
  configurable: true,
});

// Mock offline storage dependency
jest.mock('../src/lib/offline-storage', () => ({
  offlineStorage: {
    getStorageUsage: jest.fn(() => Promise.resolve({ 
      used: 1024 * 1024, 
      quota: 100 * 1024 * 1024, 
      percentage: 1 
    })),
    clearStore: jest.fn(() => Promise.resolve()),
    init: jest.fn(() => Promise.resolve()),
    saveData: jest.fn(() => Promise.resolve()),
    getData: jest.fn(() => Promise.resolve([])),
  },
}));

// Mock @testing-library/react-hooks
jest.mock('@testing-library/react-hooks', () => ({
  renderHook: jest.fn((callback) => {
    const result = { current: callback() };
    return { 
      result,
      rerender: jest.fn(),
      unmount: jest.fn(),
    };
  }),
}));

// Mock usePWA hook directly for testing
jest.mock('../src/hooks/usePWA', () => ({
  usePWA: jest.fn(() => ({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: true,
    prompt: null,
    installApp: jest.fn(() => Promise.resolve()),
    checkForUpdates: jest.fn(() => Promise.resolve()),
    hasUpdate: false,
    updateAvailable: false,
    backgroundSyncStatus: 'idle' as const,
    installMetrics: {
      installPromptShown: 0,
      installAccepted: 0,
      installDismissed: 0,
    },
    applyUpdate: jest.fn(() => Promise.resolve()),
    storageUsage: { used: 0, quota: 0, percentage: 0 },
    getStorageUsage: jest.fn(() => Promise.resolve({ used: 0, quota: 0, percentage: 0 })),
    clearOfflineData: jest.fn(() => Promise.resolve(true)),
    syncOfflineData: jest.fn(() => Promise.resolve(true)),
    validationQueue: [],
    addToValidationQueue: jest.fn(() => Promise.resolve('test-id')),
    processValidationQueue: jest.fn(() => Promise.resolve()),
    getValidationQueueStatus: jest.fn(() => ({ pending: 0, processing: 0, failed: 0 })),
    clearValidationQueue: jest.fn(() => Promise.resolve()),
    getMetrics: jest.fn(() => Promise.resolve({
      install: {
        installPromptShown: 0,
        installAccepted: 0,
        installDismissed: 0,
      },
      storage: { used: 0, quota: 0, percentage: 0 },
      online: true,
      installed: false,
      standalone: false,
      updateAvailable: false,
      backgroundSyncStatus: 'idle' as const,
      validationQueue: { pending: 0, processing: 0, failed: 0 },
    })),
  })),
}));

// Mock usePWA hook - DISABLED to allow real hook to run with mocked dependencies
// jest.mock('../src/hooks/usePWA', () => ({
//   usePWA: jest.fn(() => ({
//     syncOfflineData: jest.fn(() => Promise.resolve(true)),
//     backgroundSyncStatus: 'idle',
//     getStorageUsage: jest.fn(() => Promise.resolve({ used: 0, quota: 0, percentage: 0 })),
//     checkForUpdates: jest.fn(),
//     applyUpdate: jest.fn(),
//   })),
// }));

// Mock IndexedDB
global.indexedDB = {
  open: jest.fn(() => ({
    result: {
      name: 'mockDB',
      version: 1,
      objectStoreNames: {
        contains: jest.fn(() => true),
        length: 0,
        item: jest.fn(),
        add: jest.fn()
      },
      createObjectStore: jest.fn(),
      deleteObjectStore: jest.fn(),
      transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
          getAll: jest.fn(() => ({ result: [] })),
          put: jest.fn(),
          delete: jest.fn(),
          clear: jest.fn()
        })),
        mode: 'readonly',
        db: null,
        error: null,
        abort: jest.fn(),
        onabort: null,
        oncomplete: null,
        onerror: null
      })),
      close: jest.fn(),
      onabort: null,
      onclose: null,
      onerror: null,
      onversionchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    },
    transaction: null, // Required property for IDBOpenDBRequest
    onsuccess: jest.fn(),
    onerror: jest.fn(),
    onupgradeneeded: jest.fn(),
    onblocked: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    error: null,
    readyState: 'done',
    source: null
  })),
  deleteDatabase: jest.fn(() => ({
    onsuccess: jest.fn(),
    onerror: jest.fn(),
    onblocked: jest.fn()
  })),
  cmp: jest.fn((a, b) => a === b ? 0 : a < b ? -1 : 1),
  databases: jest.fn(() => Promise.resolve([]))
} as unknown as IDBFactory;
