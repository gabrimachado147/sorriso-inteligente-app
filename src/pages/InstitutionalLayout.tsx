
import React from 'react';
import InstitutionalHeader from '@/components/Institutional/InstitutionalHeader';
import InstitutionalFooter from '@/components/Institutional/InstitutionalFooter';

interface InstitutionalLayoutProps {
  children: React.ReactNode;
}

const InstitutionalLayout: React.FC<InstitutionalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <InstitutionalHeader />
      <main className="flex-1">
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
};

export default InstitutionalLayout;
