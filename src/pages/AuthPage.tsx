
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Phone, User, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from '@/components/ui/custom-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    telefone: '',
    password: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('telefone', formatted);
  };

  const validateForm = () => {
    if (!isLogin && !formData.nomeCompleto.trim()) {
      toastError('Erro', 'Por favor, digite seu nome completo');
      return false;
    }
    
    if (!formData.telefone.trim()) {
      toastError('Erro', 'Por favor, digite seu telefone');
      return false;
    }

    const phoneNumbers = formData.telefone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      toastError('Erro', 'Por favor, digite um telefone válido');
      return false;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toastError('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setDebugInfo('Iniciando processo de login...');
    
    if (!validateForm()) {
      setDebugInfo('Validação do formulário falhou');
      return;
    }

    setDebugInfo('Formulário validado, processando...');
    setLoading(true);

    try {
      const phoneNumbers = formData.telefone.replace(/\D/g, '');
      const phoneEmail = `${phoneNumbers}@sorriso.app`;
      
      setDebugInfo(`Email gerado: ${phoneEmail}`);

      if (isLogin) {
        setDebugInfo('Tentando fazer login...');
        
        const result = await login({
          email: phoneEmail,
          password: formData.password
        });

        setDebugInfo(`Resultado do login: ${result.success ? 'Sucesso' : 'Erro'}`);

        if (result.success) {
          toastSuccess('Sucesso', 'Login realizado com sucesso!');
          setDebugInfo('Login bem-sucedido, redirecionando...');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setDebugInfo(`Erro no login: ${result.error}`);
          toastError('Erro', result.error || 'Erro ao fazer login');
        }
      } else {
        setDebugInfo('Tentando criar conta...');
        
        const result = await register({
          email: phoneEmail,
          password: formData.password,
          nome_completo: formData.nomeCompleto,
          telefone: formData.telefone
        });

        setDebugInfo(`Resultado do registro: ${result.success ? 'Sucesso' : 'Erro'}`);

        if (result.success) {
          toastSuccess('Sucesso', 'Cadastro realizado com sucesso!');
          setDebugInfo('Registro bem-sucedido, redirecionando...');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setDebugInfo(`Erro no registro: ${result.error}`);
          toastError('Erro', result.error || 'Erro ao criar conta');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      setDebugInfo(`Erro inesperado: ${errorMessage}`);
      toastError('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                  alt="Senhor Sorriso Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Acesse sua conta' : 'Cadastre-se no Senhor Sorriso'}
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
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nome"
                      placeholder="Digite seu nome completo"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="pl-10"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha (mínimo 6 caracteres)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setDebugInfo('');
                }}
                className="text-primary font-semibold"
              >
                {isLogin ? 'Criar conta agora' : 'Fazer login'}
              </Button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Esqueci minha senha
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
