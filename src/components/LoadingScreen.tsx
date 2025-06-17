
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Carregando..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-64">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
              alt="Senhor Sorriso" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};
