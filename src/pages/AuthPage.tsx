
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { ArrowLeft, Phone, User, Lock, AlertCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess, toastWarning } from '@/components/ui/custom-toast';
import { EmailConfirmationStatus } from '@/components/Auth/EmailConfirmationStatus';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const {
    formData,
    handleInputChange,
    handlePhoneChange,
    validateEmail,
    resetForm
  } = useAuthForm();
  const {
    login,
    register,
    resetPassword
  } = useAuth();
  const navigate = useNavigate();

  const validateLoginForm = () => {
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toastError('Erro', 'Por favor, digite um email válido');
      return false;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      toastError('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toastError('Erro', 'Por favor, digite um email válido');
      return false;
    }
    if (!formData.nomeCompleto.trim()) {
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
    setDebugInfo('Iniciando processo...');
    
    if (isLogin ? !validateLoginForm() : !validateRegisterForm()) {
      setDebugInfo('Validação do formulário falhou');
      return;
    }

    setDebugInfo('Formulário validado, processando...');
    setLoading(true);
    try {
      if (isLogin) {
        setDebugInfo('Tentando fazer login...');
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        setDebugInfo(`Resultado do login: ${result.success ? 'Sucesso' : 'Erro: ' + result.error}`);
        if (result.success) {
          toastSuccess('Sucesso', 'Login realizado com sucesso!');
          setDebugInfo('Login bem-sucedido, redirecionando...');
          setTimeout(() => {
            navigate('/', {
              replace: true
            });
          }, 1500);
        } else {
          if (result.error?.includes('Email not confirmed')) {
            toastWarning('Email não confirmado', 'Verifique seu email e clique no link de confirmação');
            setPendingEmail(formData.email);
            setShowEmailConfirmation(true);
          } else if (result.error?.includes('Invalid login credentials')) {
            toastError('Erro', 'Email ou senha incorretos');
          } else {
            setDebugInfo(`Erro no login: ${result.error}`);
            toastError('Erro', result.error || 'Erro ao fazer login');
          }
        }
      } else {
        setDebugInfo('Tentando criar conta...');
        const result = await register({
          email: formData.email,
          password: formData.password,
          nome_completo: formData.nomeCompleto,
          telefone: formData.telefone
        });
        setDebugInfo(`Resultado do registro: ${result.success ? 'Sucesso' : 'Erro: ' + result.error}`);
        if (result.success) {
          toastSuccess('Conta criada!', 'Verifique seu email para confirmar a conta');
          setPendingEmail(formData.email);
          setShowEmailConfirmation(true);
          resetForm();
        } else {
          if (result.error?.includes('User already registered')) {
            toastError('Erro', 'Este email já está cadastrado. Tente fazer login.');
          } else {
            setDebugInfo(`Erro no registro: ${result.error}`);
            toastError('Erro', result.error || 'Erro ao criar conta');
          }
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

  const handlePasswordReset = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      toastError('Erro', 'Digite um email válido primeiro');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(formData.email);
      if (result.success) {
        toastSuccess('Email enviado!', 'Verifique sua caixa de entrada para redefinir sua senha');
        setShowPasswordReset(true);
        setPendingEmail(formData.email);
      } else {
        toastError('Erro', result.error || 'Erro ao enviar email de redefinição');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowEmailConfirmation(false);
    setShowPasswordReset(false);
    setPendingEmail('');
    setIsLogin(true);
    resetForm();
  };

  const handleEnterWithoutAccount = () => {
    navigate('/');
  };

  if (showEmailConfirmation) {
    return <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <EmailConfirmationStatus email={pendingEmail} onBackToLogin={handleBackToLogin} />
        </div>
      </div>;
  }

  if (showPasswordReset) {
    return <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
                {pendingEmail}
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
                <Button onClick={handleBackToLogin} variant="outline" className="w-full">
                  Voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" alt="Senhor Sorriso Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Acesse sua conta para acompanhar consultas' : 'Crie uma conta para acompanhar suas consultas e receber benefícios exclusivos'}
            </p>
            {!isLogin && <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-200">
                💡 <strong>Opcional:</strong> Você pode agendar consultas sem criar conta, mas com uma conta você poderá acompanhar seu histórico e receber benefícios.
              </p>}
          </CardHeader>

          <CardContent>
            {debugInfo && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{debugInfo}</span>
                </div>
              </div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {!isLogin && <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="nome" placeholder="Digite seu nome completo" value={formData.nomeCompleto} onChange={e => handleInputChange('nomeCompleto', e.target.value)} className="pl-10" required={!isLogin} />
                  </div>
                </div>}

              {!isLogin && <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="telefone" placeholder="(11) 99999-9999" value={formData.telefone} onChange={e => handlePhoneChange(e.target.value)} className="pl-10" maxLength={15} required={!isLogin} />
                  </div>
                </div>}

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Digite sua senha (mínimo 6 caracteres)" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-10" minLength={6} required />
                </div>
              </div>

              <Button type="submit" className="w-full py-6 text-lg font-semibold" disabled={loading}>
                {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>

              {isLogin && <Button type="button" variant="outline" className="w-full py-6 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600" onClick={handleEnterWithoutAccount}>
                  Entrar sem conta
                </Button>}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button variant="link" onClick={() => {
              setIsLogin(!isLogin);
              setDebugInfo('');
              resetForm();
            }} className="text-primary font-semibold">
                {isLogin ? 'Criar conta agora' : 'Fazer login'}
              </Button>
            </div>

            {isLogin && <div className="mt-4 text-center">
                <Button variant="link" className="text-sm text-muted-foreground" onClick={handlePasswordReset} disabled={loading}>
                  Esqueci minha senha
                </Button>
              </div>}

            <div className="mt-4 text-center border-t pt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/appointments')}>Área Exclusiva Senhor Sorriso</Button>
              <p className="text-xs text-muted-foreground mt-2">
                Você pode agendar uma consulta sem criar conta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};

export default AuthPage;
