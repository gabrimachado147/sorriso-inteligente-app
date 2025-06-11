
import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNavigation currentPage={currentPage} onPageChange={onPageChange} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};
