
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/Auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center w-full">
      <div className="w-full px-4 py-6">
        <Card className="w-full max-w-md mx-auto mobile-card-spacing">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <CardTitle className="mobile-text-xl">Bem-vindo ao Senhor Sorriso</CardTitle>
            <p className="text-muted-foreground mobile-text-base">
              Acesse sua conta ou crie uma nova
            </p>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
