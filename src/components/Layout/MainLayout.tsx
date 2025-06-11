
import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { SidebarNavigation } from './SidebarNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SidebarNavigation currentPage={currentPage} onPageChange={onPageChange} />
        <main className="flex-1 container mx-auto pb-20 md:pb-4 px-4">
          {children}
        </main>
      </div>
      <BottomNavigation currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};
