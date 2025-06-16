
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';

interface NewPasswordFormProps {
  loading: boolean;
  debugInfo: string;
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  onBackToLogin: () => void;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  loading,
  debugInfo,
  onSubmit,
  onBackToLogin
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newPassword, confirmPassword);
  };

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
              Nova Senha
            </CardTitle>
            <p className="text-muted-foreground">
              Digite sua nova senha abaixo
            </p>
          </CardHeader>
          <CardContent>
            {debugInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{debugInfo}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="Digite sua nova senha (mínimo 6 caracteres)" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="pl-10" 
                    minLength={6} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirme sua nova senha" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="pl-10" 
                    minLength={6} 
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full py-6 text-lg font-semibold" disabled={loading}>
                {loading ? 'Aguarde...' : 'Atualizar Senha'}
              </Button>
              <Button type="button" variant="outline" onClick={onBackToLogin} className="w-full">
                Voltar ao login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
