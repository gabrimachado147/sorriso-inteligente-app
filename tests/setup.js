/**
 * Jest setup for Supabase tests
 */

// Mock environment variables for testing
process.env.VITE_SUPABASE_URL = 'https://bstppllwgzkacxxwhpes.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdHBwbGx3Z3prYWN4eHdocGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDk2MjgsImV4cCI6MjA2NDYyNTYyOH0.SiKjaaf41YS0hWvJZa0bQVzDePxAn0JhBP1_qRgmvjM';

// Global test setup
global.beforeEach = global.beforeEach || (() => {});
global.afterEach = global.afterEach || (() => {});

// Mock crypto for UUID generation
if (!global.crypto) {
  global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  };
}

// Mock window object for browser APIs
if (typeof window === 'undefined') {
  global.window = {
    location: {
      origin: 'http://localhost:3000'
    }
  };
}

// Provide a basic matchMedia mock
if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
}
