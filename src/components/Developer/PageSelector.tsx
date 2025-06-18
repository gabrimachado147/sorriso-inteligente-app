
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ExternalLink, RefreshCw } from 'lucide-react';

interface PageSelectorProps {
  selectedPage: string;
  onPageChange: (page: string) => void;
  onAnalyzePage: () => void;
  loading?: boolean;
}

const availablePages = [
  { route: '/', name: 'Página Inicial', description: 'Homepage principal do projeto' },
  { route: '/appointments', name: 'Agendamentos', description: 'Sistema de agendamento de consultas' },
  { route: '/chat', name: 'Chat IA', description: 'Interface de chat com assistente virtual' },
  { route: '/clinics', name: 'Clínicas', description: 'Listagem e informações das clínicas' },
  { route: '/profile', name: 'Perfil', description: 'Perfil e configurações do usuário' },
  { route: '/developer', name: 'Developer Tools', description: 'Ferramentas de desenvolvimento (página atual)' },
  { route: '/admin', name: 'Dashboard Admin', description: 'Painel administrativo' },
  { route: '/analytics', name: 'Analytics', description: 'Relatórios e análises' },
  { route: '/gamification', name: 'Gamificação', description: 'Sistema de gamificação' },
  { route: '/reminders', name: 'Lembretes', description: 'Gerenciamento de lembretes' }
];

export const PageSelector: React.FC<PageSelectorProps> = ({
  selectedPage,
  onPageChange,
  onAnalyzePage,
  loading = false
}) => {
  const currentPage = availablePages.find(page => page.route === selectedPage);

  const handleVisitPage = () => {
    if (selectedPage && selectedPage !== window.location.pathname) {
      window.open(selectedPage, '_blank');
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Seletor de Páginas para Análise
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            PÁGINA DINÂMICA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Selecione a página para análise:
          </label>
          <Select value={selectedPage} onValueChange={onPageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma página para analisar" />
            </SelectTrigger>
            <SelectContent>
              {availablePages.map((page) => (
                <SelectItem key={page.route} value={page.route}>
                  <div className="flex flex-col">
                    <span className="font-medium">{page.name}</span>
                    <span className="text-xs text-muted-foreground">{page.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentPage && (
          <div className="p-3 bg-white/60 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{currentPage.name}</div>
                <div className="text-xs text-muted-foreground">
                  Rota: <code className="bg-gray-100 px-1 rounded">{currentPage.route}</code>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {currentPage.description}
                </div>
              </div>
              {selectedPage !== window.location.pathname && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVisitPage}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visitar
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          💡 Dica: Selecione uma página e configure a IA desejada antes de analisar
        </div>
      </CardContent>
    </Card>
  );
};
