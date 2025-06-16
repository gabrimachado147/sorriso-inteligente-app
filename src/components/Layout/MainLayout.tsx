
import React from 'react';
import { Header } from './Header';
import BottomNavigation from './BottomNavigation';
import { FloatingChatBubble } from '../Chat/FloatingChatBubble';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <Header />
      <main className="flex-1 pb-36 md:pb-12 w-full">
        {children}
      </main>
      <BottomNavigation />
      <FloatingChatBubble />
    </div>
  );
};
