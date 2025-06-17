
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import { AppProvider } from '@/store/AppContext';
import { AccessibilityManager } from '@/components/Accessibility/AccessibilityManager';

// Mock Supabase client for tests
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Custom render function with all providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AccessibilityManager>
          <AppProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AppProvider>
        </AccessibilityManager>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Test helpers
export const createMockAppointment = (overrides = {}) => ({
  id: 'test-appointment-id',
  name: 'João Silva',
  phone: '11999999999',
  email: 'joao@email.com',
  date: '2024-01-15',
  time: '10:00',
  clinic: 'Senhor Sorriso São Paulo Centro',
  service: 'Avaliação Gratuita',
  status: 'confirmed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@email.com',
  full_name: 'Test User',
  phone: '11999999999',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

// Accessibility test helpers
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe } = await import('@axe-core/react');
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Performance test helpers
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
  
  return duration;
};
