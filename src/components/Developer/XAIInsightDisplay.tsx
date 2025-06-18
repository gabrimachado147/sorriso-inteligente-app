
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';

interface XAIInsightDisplayProps {
  insight: string;
}

export const XAIInsightDisplay: React.FC<XAIInsightDisplayProps> = ({ insight }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!insight) return null;

  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-purple-800 flex items-center justify-between">
          <span>Insight Completo do Grok:</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(insight)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadAsFile(insight, 'grok-insight.md')}
              className="h-8 w-8 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-purple-900 whitespace-pre-wrap break-words font-mono overflow-visible max-h-none">
            {insight}
          </div>
        </div>
        <div className="mt-4 p-3 bg-purple-100 rounded text-xs text-purple-700">
          <strong>💡 Dica:</strong> Use os botões acima para copiar ou baixar o código completo. 
          O Grok fornece exemplos completos de implementação que você pode usar diretamente no projeto.
          Todo o conteúdo é exibido sem limitações de altura.
        </div>
      </CardContent>
    </Card>
  );
};
