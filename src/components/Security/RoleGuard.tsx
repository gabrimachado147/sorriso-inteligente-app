
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'dentist' | 'patient' | 'staff'>;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = <div className="p-4 text-center text-gray-500">Acesso negado</div>
}) => {
  const { state } = useAppContext();
  
  if (!state.user) {
    return (
      <div className="p-4 text-center text-gray-500">
        Faça login para acessar esta página
      </div>
    );
  }
  
  if (!allowedRoles.includes(state.user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
