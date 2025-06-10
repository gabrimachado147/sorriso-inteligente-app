import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { animations } from '@/lib/animations';

const ProfilePage: React.FC = () => {
  const {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    if (!result.success) setFormError(result.error || 'Falha no login');
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await register({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    });
    if (!result.success) setFormError(result.error || 'Falha no cadastro');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`max-w-md mx-auto space-y-6 p-6 ${animations.fadeIn}`}>
        <Card>
          <CardHeader>
            <CardTitle>Acessar Conta</CardTitle>
          </CardHeader>
          <CardContent>
            {(error || formError) && (
              <Alert className="mb-4">
                <AlertDescription>{error || formError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="email" type="email" placeholder="seu@email.com" required />
              <Input name="password" type="password" placeholder="Senha" required />
              <Button type="submit" className={animations.buttonHover}>
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input name="name" type="text" placeholder="Nome completo" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" type="tel" placeholder="Telefone" />
              <Input name="password" type="password" placeholder="Senha" required />
              <Button type="submit" className={animations.buttonHover}>
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.fadeIn}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Olá, {profile?.full_name || user?.email}
            <Button variant="outline" size="sm" onClick={logout} className={animations.buttonHover}>
              Sair
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Email:</strong> {profile?.email || user?.email}
          </div>
          <div>
            <strong>Telefone:</strong> {profile?.phone || 'Não informado'}
          </div>
          <div>
            <strong>Membro desde:</strong>
            {' '}
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

