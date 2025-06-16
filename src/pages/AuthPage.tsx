
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmailConfirmationStatus } from '@/components/Auth/EmailConfirmationStatus';
import { NewPasswordForm } from '@/components/Auth/NewPasswordForm';
import { PasswordResetStatus } from '@/components/Auth/PasswordResetStatus';
import { AuthHeader } from '@/components/Auth/AuthHeader';
import { AuthForm } from '@/components/Auth/AuthForm';
import { useAuthPage } from '@/hooks/useAuthPage';

const AuthPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useAuthPage();

  if (showNewPasswordForm) {
    return (
      <NewPasswordForm
        loading={loading}
        debugInfo={debugInfo}
        onSubmit={handleNewPasswordSubmit}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <EmailConfirmationStatus email={pendingEmail} onBackToLogin={handleBackToLogin} />
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <PasswordResetStatus
        email={pendingEmail}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <AuthHeader isLogin={isLogin} />

          <CardContent>
            {debugInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{debugInfo}</span>
                </div>
              </div>
            )}

            <AuthForm
              isLogin={isLogin}
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onPhoneChange={handlePhoneChange}
              onSubmit={handleSubmit}
              onToggleMode={handleToggleMode}
              onPasswordReset={handlePasswordReset}
              onEnterWithoutAccount={handleEnterWithoutAccount}
            />

            <div className="mt-4 text-center border-t pt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/appointments')}>
                Área Exclusiva Senhor Sorriso
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Você pode agendar uma consulta sem criar conta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
