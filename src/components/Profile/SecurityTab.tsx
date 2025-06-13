
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Smartphone, AlertTriangle } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const SecurityTab = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toastError('Erro', 'Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toastError('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Simular mudança de senha - em produção, usar supabase.auth.updateUser
      await new Promise(resolve => setTimeout(resolve, 1000));
      toastSuccess('Senha alterada', 'Sua senha foi alterada com sucesso');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toastError('Erro', 'Não foi possível alterar a senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      setTwoFactorEnabled(enabled);
      toastSuccess(
        enabled ? '2FA Ativado' : '2FA Desativado',
        enabled ? 'Autenticação em duas etapas ativada' : 'Autenticação em duas etapas desativada'
      );
    } catch (error) {
      toastError('Erro', 'Não foi possível alterar as configurações de 2FA');
      setTwoFactorEnabled(!enabled);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
            />
          </div>
          <Button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="w-full"
          >
            {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </CardContent>
      </Card>

      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium">Alertas de Login</p>
                <p className="text-sm text-gray-600">Receba notificações de novos logins</p>
              </div>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              min="5"
              max="120"
            />
            <p className="text-xs text-gray-500">
              Sua sessão expirará automaticamente após este período de inatividade
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
