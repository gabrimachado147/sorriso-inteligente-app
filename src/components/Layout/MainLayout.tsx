
import React from 'react';
import { Header } from './Header';
import BottomNavigation from './BottomNavigation';
import { DevelopmentPanel } from './DevelopmentPanel';
import { isDevelopment } from '@/config/development';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-4">
        {children}
      </main>
      <BottomNavigation />
      
      {/* Painel de desenvolvimento - só aparece em dev */}
      {isDevelopment && <DevelopmentPanel />}
    </div>
  );
};
