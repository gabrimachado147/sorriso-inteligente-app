
import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface InstitutionalLayoutProps {
  children: React.ReactNode;
}

export const InstitutionalLayout: React.FC<InstitutionalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <InstitutionalHeader />
      <main className="w-full">
        <div className="mobile-container max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};
