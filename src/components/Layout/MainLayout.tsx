
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mobile-nav">
        <div className="md:container md:mx-auto mobile-container">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};
