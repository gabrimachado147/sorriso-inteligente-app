
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PasswordResetStatusProps {
  email: string;
  onBackToLogin: () => void;
}

export const PasswordResetStatus: React.FC<PasswordResetStatusProps> = ({
  email,
  onBackToLogin
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" alt="Senhor Sorriso Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Email Enviado!
            </CardTitle>
            <p className="text-muted-foreground">
              Enviamos um link para redefinir sua senha para:
            </p>
            <p className="text-sm font-medium text-primary mt-1">
              {email}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Clique no link do email para criar uma nova senha. O link é válido por 1 hora.
              </p>
              <p className="text-xs text-muted-foreground">
                Não esqueça de verificar a pasta de spam!
              </p>
              <Button onClick={onBackToLogin} variant="outline" className="w-full">
                Voltar ao login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
