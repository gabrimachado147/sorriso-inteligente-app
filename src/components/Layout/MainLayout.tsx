
import React from 'react';
import { Header } from './Header';
import BottomNavigation from './BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full mobile-scroll">
      <Header />
      <main className="flex-1 pb-20 md:pb-6 w-full">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};
