
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface XAIConfigurationWarningProps {
  onRefreshConfig: () => void;
}

export const XAIConfigurationWarning: React.FC<XAIConfigurationWarningProps> = ({ 
  onRefreshConfig 
}) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          XAI/Grok não configurado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-orange-700 text-sm">
          Configure a API key do Grok no Supabase para usar insights de IA durante o desenvolvimento.
        </p>
        <div className="space-y-2">
          <p className="text-xs text-orange-600">
            <strong>Passos para configurar:</strong>
          </p>
          <ol className="text-xs text-orange-600 list-decimal list-inside space-y-1 pl-2">
            <li>Acesse as configurações do Supabase</li>
            <li>Vá para "Settings" → "Secrets"</li>
            <li>Adicione a secret "XAI_API_KEY" com sua chave do Grok</li>
            <li>Clique em "Verificar Configuração" abaixo</li>
          </ol>
        </div>
        <Button
          onClick={onRefreshConfig}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Verificar Configuração
        </Button>
      </CardContent>
    </Card>
  );
};
