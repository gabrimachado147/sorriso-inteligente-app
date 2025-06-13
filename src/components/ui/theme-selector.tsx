
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, Clock } from 'lucide-react';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  theme: 'light' | 'dark' | 'auto';
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  currentTheme,
  onThemeChange
}) => {
  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'auto', label: 'Automático', icon: Clock }
  ] as const;

  return (
    <Card className={animations.fadeIn}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Aparência</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={theme === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onThemeChange(id)}
                className={cn(
                  'flex flex-col h-auto py-3 px-2',
                  animations.buttonHover
                )}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {theme === 'auto' 
              ? `Modo automático: ${currentTheme === 'dark' ? 'Escuro (Noite)' : 'Claro (Dia)'}`
              : `Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativo`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
