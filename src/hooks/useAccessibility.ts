
import { useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  screenReader: boolean;
  voiceNavigation: boolean;
  reducedMotion: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    highContrast: false,
    colorBlindMode: 'none',
    screenReader: false,
    voiceNavigation: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Carregar configurações salvas
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Detectar preferências do sistema
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Aplicar configurações no documento
    applyFontSize(settings.fontSize);
    applyHighContrast(settings.highContrast);
    applyColorBlindMode(settings.colorBlindMode);
    applyReducedMotion(settings.reducedMotion);

    // Salvar configurações
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    const sizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '22px'
    };
    root.style.setProperty('--base-font-size', sizeMap[size as keyof typeof sizeMap]);
    root.style.fontSize = sizeMap[size as keyof typeof sizeMap];
  };

  const applyHighContrast = (enabled: boolean) => {
    document.documentElement.classList.toggle('high-contrast', enabled);
  };

  const applyColorBlindMode = (mode: string) => {
    document.documentElement.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (mode !== 'none') {
      document.documentElement.classList.add(mode);
    }
  };

  const applyReducedMotion = (enabled: boolean) => {
    document.documentElement.classList.toggle('reduced-motion', enabled);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string) => {
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  return {
    settings,
    updateSetting,
    announceToScreenReader
  };
};
