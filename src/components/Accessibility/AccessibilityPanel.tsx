
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Accessibility, Type, Eye, Volume2 } from 'lucide-react';

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSetting, announceToScreenReader } = useAccessibility();

  const handleFontSizeChange = (size: string) => {
    updateSetting('fontSize', size as 'small' | 'medium' | 'large' | 'extra-large');
    announceToScreenReader(`Tamanho da fonte alterado para ${size}`);
  };

  const handleColorBlindModeChange = (mode: string) => {
    updateSetting('colorBlindMode', mode as 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia');
    announceToScreenReader(`Modo para daltonismo alterado para ${mode}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Configurações de Acessibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tamanho da Fonte */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Tamanho da Fonte
          </Label>
          <Select
            value={settings.fontSize}
            onValueChange={handleFontSizeChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="extra-large">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alto Contraste */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Alto Contraste
          </Label>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => {
              updateSetting('highContrast', checked);
              announceToScreenReader(`Alto contraste ${checked ? 'ativado' : 'desativado'}`);
            }}
          />
        </div>

        {/* Modo Daltonismo */}
        <div className="space-y-2">
          <Label>Suporte para Daltonismo</Label>
          <Select
            value={settings.colorBlindMode}
            onValueChange={handleColorBlindModeChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              <SelectItem value="deuteranopia">Deuteranopia (Verde)</SelectItem>
              <SelectItem value="protanopia">Protanopia (Vermelho)</SelectItem>
              <SelectItem value="tritanopia">Tritanopia (Azul)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leitor de Tela */}
        <div className="flex items-center justify-between">
          <Label>Suporte a Leitor de Tela</Label>
          <Switch
            checked={settings.screenReader}
            onCheckedChange={(checked) => {
              updateSetting('screenReader', checked);
              if (checked) {
                announceToScreenReader('Suporte a leitor de tela ativado');
              }
            }}
          />
        </div>

        {/* Navegação por Voz */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Navegação por Voz
          </Label>
          <Switch
            checked={settings.voiceNavigation}
            onCheckedChange={(checked) => {
              updateSetting('voiceNavigation', checked);
              announceToScreenReader(`Navegação por voz ${checked ? 'ativada' : 'desativada'}`);
            }}
          />
        </div>

        {/* Movimento Reduzido */}
        <div className="flex items-center justify-between">
          <Label>Reduzir Animações</Label>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => {
              updateSetting('reducedMotion', checked);
              announceToScreenReader(`Animações ${checked ? 'reduzidas' : 'normais'}`);
            }}
          />
        </div>

        <Button 
          className="w-full"
          onClick={() => announceToScreenReader('Configurações de acessibilidade aplicadas com sucesso')}
        >
          Aplicar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
