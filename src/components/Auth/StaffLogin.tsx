
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, AlertCircle } from 'lucide-react';
import { animations } from '@/lib/animations';

interface StaffLoginProps {
  onLogin: (username: string) => void;
}

const STAFF_CREDENTIALS = {
  campobelo: 'sscampobelo',
  formiga: 'ssformiga',
  itarare: 'ssitarare',
  capaobonito: 'sscapaobonito',
  itapeva: 'ssitapeva'
};

const CLINIC_NAMES = {
  campobelo: 'Senhor Sorriso Campobelo',
  formiga: 'Senhor Sorriso Formiga',
  itarare: 'Senhor Sorriso Itararé',
  capaobonito: 'Senhor Sorriso Capão Bonito',
  itapeva: 'Senhor Sorriso Itapeva'
};

export const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials = STAFF_CREDENTIALS as Record<string, string>;
      
      if (credentials[username] === password) {
        onLogin(username);
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 ${animations.fadeIn}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acesso Funcionários</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Entre com suas credenciais para acessar os agendamentos
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { CLINIC_NAMES };
