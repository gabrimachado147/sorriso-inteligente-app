
import { useState } from 'react';

interface ProjectInfo {
  components: number;
  hooks: number;
  pages: number;
  componentList: string[];
  hookList: string[];
  pageList: string[];
}

export const useDevelopmentPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  // Check Supabase configuration (using actual project values)
  const supabaseUrl = 'https://bstppllwgzkacxxwhpes.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdHBwbGx3Z3prYWN4eHdocGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDk2MjgsImV4cCI6MjA2NDYyNTYyOH0.SiKjaaf41YS0hWvJZa0bQVzDePxAn0JhBP1_qRgmvjM';
  
  const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

  // Informações detalhadas do projeto
  const getProjectInfo = (): ProjectInfo => {
    const components = [
      'EnhancedHomePage', 'ChatBot', 'AdminDashboard', 'AppointmentScheduler',
      'BrandedDashboardHeader', 'StrategicKPISection', 'QuickActionsCTA'
    ];
    
    const hooks = [
      'useAuth', 'useChatHandler', 'useChatLogic', 'useHomeNavigation',
      'useSupabase', 'useXAI', 'useNotificationSystem'
    ];

    const pages = [
      '/chat', '/admin-dashboard', '/appointments', '/schedule', '/profile'
    ];

    return {
      components: components.length,
      hooks: hooks.length,
      pages: pages.length,
      componentList: components,
      hookList: hooks,
      pageList: pages
    };
  };

  return {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    isSupabaseConfigured,
    projectInfo: getProjectInfo()
  };
};
