
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, ChevronDown, ChevronUp, Copy, Download } from 'lucide-react';
import { quickPrompts } from './quickPrompts';

interface XAIQuickPromptsProps {
  expandedPrompt: number | null;
  onExpandPrompt: (index: number | null) => void;
  onSelectPrompt: (prompt: string) => void;
}

export const XAIQuickPrompts: React.FC<XAIQuickPromptsProps> = ({
  expandedPrompt,
  onExpandPrompt,
  onSelectPrompt
}) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="h-4 w-4" />
          Prompts Pré-configurados (Clique para ver completo)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickPrompts.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => onSelectPrompt(item.prompt)}
                    className="flex-1 justify-start text-left h-auto p-0"
                  >
                    <div className="w-full">
                      <div className="font-medium text-sm text-purple-700">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Clique para usar este prompt completo
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExpandPrompt(expandedPrompt === index ? null : index)}
                    className="ml-2"
                  >
                    {expandedPrompt === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expandedPrompt === index && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-600">Prompt Completo:</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.prompt)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadAsFile(item.prompt, `prompt-${item.title.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono bg-white p-2 rounded border max-h-none overflow-visible">
                      {item.prompt}
                    </div>
                  </div>
                )}
              </div>
              {index < quickPrompts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
