
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Code, Sparkles, Rocket } from 'lucide-react';

export const DeveloperPageHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-green-600/5 rounded-3xl blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Code className="h-12 w-12 text-primary animate-pulse" />
            <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Developer Tools Pro
          </h1>
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm animate-pulse">
              AMBIENTE AVANÇADO
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              <Rocket className="h-3 w-3 mr-1" />
              AI-POWERED
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground max-w-4xl mx-auto text-lg leading-relaxed">
          <strong className="text-primary">Potencialize sua eficácia</strong> com nossas ferramentas AI-driven: 
          análise de código avançada, automação fluente e insights incríveis que transformam 
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"> desenvolvedores em arquitetos digitais</span>
        </p>
      </div>
    </div>
  );
};
