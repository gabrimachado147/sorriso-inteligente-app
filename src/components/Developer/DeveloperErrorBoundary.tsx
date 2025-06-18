
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Code, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class DeveloperErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log do erro para monitoramento
    console.error('Developer Tools Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Erro no Developer Tools
              <Badge variant="destructive" className="text-xs">
                ERRO CAPTURADO
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-600">
              Ops! Algo deu errado no painel de desenvolvedor. Este erro foi capturado automaticamente.
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={this.handleReset}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Tentar Novamente
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Recarregar Página
              </Button>
            </div>

            <details className="mt-4">
              <summary className="text-xs text-red-600 cursor-pointer mb-2 flex items-center gap-1">
                <Bug className="h-3 w-3" />
                Detalhes Técnicos (Para Desenvolvedores)
              </summary>
              <div className="bg-red-100 p-3 rounded text-xs font-mono">
                <div className="mb-2">
                  <strong>Erro:</strong> {this.state.error?.message}
                </div>
                <div className="mb-2">
                  <strong>Stack:</strong>
                  <pre className="mt-1 text-xs overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
