
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { toastInfo, toastSuccess, toastError } from '@/components/ui/custom-toast';
import { AuthService } from '@/services/auth';

interface EmailConfirmationStatusProps {
  email: string;
  onBackToLogin: () => void;
}

export const EmailConfirmationStatus: React.FC<EmailConfirmationStatusProps> = ({
  email,
  onBackToLogin
}) => {
  const [isResending, setIsResending] = React.useState(false);

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const result = await AuthService.resetPassword(email);
      if (result.success) {
        toastSuccess('Email reenviado', 'Verifique sua caixa de entrada novamente');
      } else {
        toastError('Erro', 'Não foi possível reenviar o email');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao reenviar email de confirmação');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirme seu email
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Enviamos um link de confirmação para:
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {email}
            </p>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>Clique no link do email para ativar sua conta.</p>
            <p className="text-xs">Não esqueça de verificar a pasta de spam!</p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleResendConfirmation}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Reenviar email
                </>
              )}
            </Button>

            <Button
              onClick={onBackToLogin}
              variant="ghost"
              className="w-full"
            >
              Voltar ao login
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
