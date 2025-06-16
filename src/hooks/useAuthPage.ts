
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { toastError, toastSuccess, toastWarning } from '@/components/ui/custom-toast';

export const useAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [searchParams] = useSearchParams();
  
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
    resetPassword,
    updatePassword
  } = useAuth();
  const navigate = useNavigate();

  // Check if we're in password reset mode or have auth tokens
  useEffect(() => {
    const mode = searchParams.get('mode');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    console.log('AuthPage: URL params detected:', { mode, accessToken: !!accessToken, refreshToken: !!refreshToken, type });
    
    // If we have tokens from email link, set the session
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('AuthPage: Password recovery tokens detected, showing new password form');
      setShowNewPasswordForm(true);
      setDebugInfo('Link de redefinição de senha detectado. Digite sua nova senha abaixo.');
    } else if (mode === 'reset-password') {
      console.log('AuthPage: Reset password mode detected');
      setShowNewPasswordForm(true);
    }
  }, [searchParams]);

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

  const handleNewPasswordSubmit = async (newPassword: string, confirmPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      toastError('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toastError('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      console.log('AuthPage: Attempting to update password');
      const result = await updatePassword(newPassword);
      console.log('AuthPage: Update password result:', result);
      
      if (result.success) {
        toastSuccess('Sucesso', 'Senha atualizada com sucesso!');
        setDebugInfo('Senha atualizada! Redirecionando para a página inicial...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      } else {
        console.error('AuthPage: Password update failed:', result.error);
        toastError('Erro', result.error || 'Erro ao atualizar senha');
        setDebugInfo(`Erro ao atualizar senha: ${result.error}`);
      }
    } catch (error) {
      console.error('AuthPage: Password update exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar solicitação';
      toastError('Erro', errorMessage);
      setDebugInfo(`Erro inesperado: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowEmailConfirmation(false);
    setShowPasswordReset(false);
    setShowNewPasswordForm(false);
    setPendingEmail('');
    setIsLogin(true);
    resetForm();
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setDebugInfo('');
    resetForm();
  };

  const handleEnterWithoutAccount = () => {
    navigate('/');
  };

  return {
    isLogin,
    loading,
    showEmailConfirmation,
    showPasswordReset,
    showNewPasswordForm,
    pendingEmail,
    debugInfo,
    formData,
    handleInputChange,
    handlePhoneChange,
    handleSubmit,
    handlePasswordReset,
    handleNewPasswordSubmit,
    handleBackToLogin,
    handleToggleMode,
    handleEnterWithoutAccount
  };
};
