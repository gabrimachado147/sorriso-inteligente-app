
import React from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { animations } from '@/lib/animations';

interface BrandedDashboardHeaderProps {
  clinicName: string;
  userName?: string;
}

export const BrandedDashboardHeader: React.FC<BrandedDashboardHeaderProps> = ({
  clinicName,
  userName = 'Administrador'
}) => {
  return (
    <div className={`${animations.fadeIn} mb-8`}>
      {/* Hero Section com Branding */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Crown className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  Sorriso Inteligente
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-lg">
                  Bem-vindo, {userName}! Vamos cuidar de mais sorrisos hoje? 😊
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)} • Dashboard Administrativo
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="text-sm font-medium">Missão do Dia</span>
                </div>
                <p className="text-xs text-blue-100">
                  "Cada sorriso que cuidamos é uma vida que transformamos"
                </p>
              </div>
            </div>
          </div>
          
          {/* CTAs Estratégicos */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Agendar Nova Consulta
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
            >
              Ver Relatório do Dia
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              Gerenciar Pacientes
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Indicadores de Status */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">🟢</div>
            <p className="text-sm text-green-700 font-medium">Sistema Online</p>
            <p className="text-xs text-green-600">Tudo funcionando perfeitamente</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">⚡</div>
            <p className="text-sm text-blue-700 font-medium">Performance Excelente</p>
            <p className="text-xs text-blue-600">Carregamento rápido garantido</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">🔒</div>
            <p className="text-sm text-purple-700 font-medium">Dados Seguros</p>
            <p className="text-xs text-purple-600">Proteção total com Supabase</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
