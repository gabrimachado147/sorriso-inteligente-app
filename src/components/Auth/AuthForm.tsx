
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, User, Lock, Mail, UserCog } from 'lucide-react';
import { AuthFormData } from '@/hooks/useAuthForm';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isLogin: boolean;
  formData: AuthFormData;
  loading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
  onPasswordReset: () => void;
  onEnterWithoutAccount: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  formData,
  loading,
  onInputChange,
  onPhoneChange,
  onSubmit,
  onToggleMode,
  onPasswordReset,
  onEnterWithoutAccount
}) => {
  const navigate = useNavigate();

  const handleStaffAccess = () => {
    navigate('/staff-login');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="email" 
            type="email" 
            placeholder="seu@email.com" 
            value={formData.email} 
            onChange={(e) => onInputChange('email', e.target.value)} 
            className="pl-10 h-11" 
            required 
          />
        </div>
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm font-medium">Nome Completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="nome" 
              placeholder="Digite seu nome completo" 
              value={formData.nomeCompleto} 
              onChange={(e) => onInputChange('nomeCompleto', e.target.value)} 
              className="pl-10 h-11" 
              required={!isLogin} 
            />
          </div>
        </div>
      )}

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="telefone" 
              placeholder="(11) 99999-9999" 
              value={formData.telefone} 
              onChange={(e) => onPhoneChange(e.target.value)} 
              className="pl-10 h-11" 
              maxLength={15} 
              required={!isLogin} 
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="password" 
            type="password" 
            placeholder="Digite sua senha (mínimo 6 caracteres)" 
            value={formData.password} 
            onChange={(e) => onInputChange('password', e.target.value)} 
            className="pl-10 h-11" 
            minLength={6} 
            required 
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold mt-6" disabled={loading}>
        {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
      </Button>

      {isLogin && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-12 text-base font-semibold bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600" 
          onClick={onEnterWithoutAccount}
        >
          Entrar sem conta
        </Button>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        </p>
        <Button 
          variant="link" 
          onClick={onToggleMode} 
          className="text-primary font-semibold p-0 h-auto"
          type="button"
        >
          {isLogin ? 'Criar conta agora' : 'Fazer login'}
        </Button>
        
        {isLogin && (
          <p className="text-xs text-muted-foreground mt-2">
            Você pode agendar uma consulta sem criar conta
          </p>
        )}
      </div>

      {isLogin && (
        <div className="mt-4 text-center space-y-3">
          <Button 
            variant="link" 
            className="text-sm text-muted-foreground p-0 h-auto" 
            onClick={onPasswordReset} 
            disabled={loading}
            type="button"
          >
            Esqueci minha senha
          </Button>

          <Button 
            variant="default"
            size="sm"
            onClick={handleStaffAccess}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg text-sm"
            type="button"
          >
            <UserCog className="h-4 w-4 mr-2 flex-shrink-0" />
            Painel Admin
          </Button>
        </div>
      )}
    </form>
  );
};
