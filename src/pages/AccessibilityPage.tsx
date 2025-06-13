
import React from 'react';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

const AccessibilityPage = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <AccessibilityPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AccessibilityPage;
