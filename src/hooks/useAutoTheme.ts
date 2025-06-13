
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export const useAutoTheme = () => {
  const [theme, setTheme] = useState<Theme>('auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Detectar tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Aplicar tema baseado no horário quando em modo auto
    if (theme === 'auto') {
      const hour = new Date().getHours();
      const isNightTime = hour >= 18 || hour <= 6;
      const autoTheme = isNightTime ? 'dark' : 'light';
      
      document.documentElement.classList.toggle('dark', autoTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, systemTheme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const currentTheme = theme === 'auto' ? 
    (new Date().getHours() >= 18 || new Date().getHours() <= 6 ? 'dark' : 'light') : 
    theme;

  return {
    theme,
    currentTheme,
    changeTheme
  };
};
