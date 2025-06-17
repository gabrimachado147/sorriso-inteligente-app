
import React from 'react';
import InstitutionalLayout from '@/components/Institutional/InstitutionalLayout';

interface InstitutionalLayoutPageProps {
  children: React.ReactNode;
}

const InstitutionalLayoutPage: React.FC<InstitutionalLayoutPageProps> = ({ children }) => {
  return (
    <InstitutionalLayout>
      {children}
    </InstitutionalLayout>
  );
};

export default InstitutionalLayoutPage;
