
import React from 'react';
import InstitutionalHeader from '@/components/Institutional/InstitutionalHeader';
import InstitutionalFooter from '@/components/Institutional/InstitutionalFooter';

interface InstitutionalLayoutProps {
  children: React.ReactNode;
}

const InstitutionalLayout: React.FC<InstitutionalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background overflow-x-hidden">
      <InstitutionalHeader />
      <main className="flex-1 w-full mobile-scroll">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      <InstitutionalFooter />
    </div>
  );
};

export default InstitutionalLayout;
