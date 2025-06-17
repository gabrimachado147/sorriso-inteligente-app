
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static override getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Oops! Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Encontramos um erro inesperado. Tente novamente ou recarregue a página.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <details className="text-sm">
                    <summary className="font-medium text-red-800 cursor-pointer">
                      Detalhes do erro (desenvolvimento)
                    </summary>
                    <pre className="mt-2 text-red-700 whitespace-pre-wrap overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={this.handleRetry} 
                  variant="outline" 
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
