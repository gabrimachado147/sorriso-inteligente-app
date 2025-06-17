
import React from 'react';
import { Header } from './Header';
import BottomNavigation from './BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full mobile-scroll pb-24 md:pb-8">
        <div className="mobile-container px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};
