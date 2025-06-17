import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAutoTheme } from '@/hooks/useAutoTheme';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';

export const AccessibilityTab = () => {
  const { theme, changeTheme } = useAutoTheme();

  return (
    <div className="space-y-6">
      <AccessibilityPanel />
      
      <Card className={`${animations.fadeIn} mobile-card-spacing`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 mobile-text-lg text-lg">
            <Settings className="h-5 w-5" />
            Tema e Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="mobile-text-sm">Tema Atual</Label>
              <p className="text-sm text-gray-600 mobile-text-xs">
                {theme === 'auto' ? 'Automático (baseado no horário)' : 
                 theme === 'dark' ? 'Escuro' : 'Claro'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => changeTheme('light')}
                className="mobile-touch-target"
              >
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => changeTheme('dark')}
                className="mobile-touch-target"
              >
                Escuro
              </Button>
              <Button
                variant={theme === 'auto' ? 'default' : 'outline'}
                size="sm"
                onClick={() => changeTheme('auto')}
                className="mobile-touch-target"
              >
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
