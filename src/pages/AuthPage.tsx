
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/Auth/AuthForm';
import { useAuthPage } from '@/hooks/useAuthPage';
import { animations } from '@/lib/animations';

const AuthPage = () => {
  const {
    isLogin,
    loading,
    formData,
    handleInputChange,
    handlePhoneChange,
    handleSubmit,
    handlePasswordReset,
    handleToggleMode,
    handleEnterWithoutAccount
  } = useAuthPage();

  return (
    <div className={`space-y-6 ${animations.pageEnter} flex items-center justify-center min-h-[60vh]`}>
      <Card className="w-full max-w-md mx-auto mobile-card-spacing">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
              alt="Senhor Sorriso" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="mobile-text-xl text-lg text-center">Bem-vindo ao Senhor Sorriso</CardTitle>
          <p className="text-muted-foreground mobile-text-base text-center">
            Acesse sua conta ou crie uma nova
          </p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
