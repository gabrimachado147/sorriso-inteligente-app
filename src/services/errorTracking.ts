import React from 'react';

interface ErrorContext {
  userId?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class ErrorTracker {
  private errors: Array<{ error: Error; context: ErrorContext }> = [];
  private maxErrors = 100;

  reportError(error: Error, context: Partial<ErrorContext> = {}): void {
    const fullContext: ErrorContext = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...context
    };

    this.errors.push({ error, context: fullContext });

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🐛 Error Tracked');
      console.error('Error:', error);
      console.log('Context:', fullContext);
      console.groupEnd();
    }

    // In production, you might want to send to external service
    // this.sendToErrorService(error, fullContext);
  }

  reportCustomError(message: string, context: Partial<ErrorContext> = {}): void {
    this.reportError(new Error(message), context);
  }

  getErrors(): Array<{ error: Error; context: ErrorContext }> {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  setupGlobalErrorHandlers(): void {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        component: 'Global Error Handler',
        action: 'Unhandled Error'
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'Global Error Handler',
          action: 'Unhandled Promise Rejection'
        }
      );
    });
  }
}

export const errorTracker = new ErrorTracker();

// React Error Boundary utility
export const createErrorBoundary = (component: string) => {
  return class extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorTracker.reportError(error, {
        component,
        action: 'Component Error',
        errorInfo: JSON.stringify(errorInfo)
      });
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          className: 'p-4 text-center text-red-600'
        }, [
          React.createElement('h3', { key: 'title' }, 'Ops! Algo deu errado'),
          React.createElement('p', { 
            key: 'message',
            className: 'text-sm' 
          }, 'Recarregue a página ou tente novamente mais tarde.')
        ]);
      }

      return this.props.children;
    }
  };
};
