
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center w-full">
      <div className="w-full px-4 py-6">
        <Card className="w-full max-w-md mx-auto mobile-card-spacing text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😕</span>
            </div>
            <CardTitle className="mobile-text-xl">Página não encontrada</CardTitle>
            <p className="text-muted-foreground mobile-text-base">
              A página que você está procurando não existe ou foi movida.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoHome}
              className="w-full mobile-button"
              size="lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Voltar ao Início
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full mobile-button"
              size="lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
