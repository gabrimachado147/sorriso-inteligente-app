
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@/components/SEO/PageHead';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { animations } from '@/lib/animations';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageHead
        title="Página não encontrada - Senhor Sorriso"
        description="A página que você está procurando não foi encontrada. Retorne ao início do aplicativo Senhor Sorriso."
        keywords="página não encontrada, erro 404, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/404"
      />
      <div className={`space-y-6 ${animations.pageEnter} flex items-center justify-center min-h-[60vh]`}>
        <Card className="w-full max-w-md mx-auto mobile-card-spacing text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😕</span>
            </div>
            <CardTitle className="mobile-text-xl text-lg text-center">Página não encontrada</CardTitle>
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
    </>
  );
};

export default NotFound;
