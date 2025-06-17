
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" alt="Senhor Sorriso Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      <CardTitle className="text-lg font-bold text-primary text-center">
        {isLogin ? 'Entrar' : 'Criar Conta'}
      </CardTitle>
      <p className="text-muted-foreground text-center">
        {isLogin ? 'Acesse sua conta para acompanhar consultas' : 'Crie uma conta para acompanhar suas consultas e receber benefícios exclusivos'}
      </p>
      {!isLogin && (
        <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-200 text-center">
          💡 <strong>Opcional:</strong> Você pode agendar consultas sem criar conta, mas com uma conta você poderá acompanhar seu histórico e receber benefícios.
        </p>
      )}
    </CardHeader>
  );
};
