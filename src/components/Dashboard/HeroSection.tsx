
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Phone, Star, Heart } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export const HeroSection = () => {
  const { user, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  // Get user's first name from profile or email
  const getUserFirstName = () => {
    if (profile?.nome_completo) {
      return profile.nome_completo.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  const firstName = getUserFirstName();

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 ${animations.pageEnter}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${animations.slideInLeft}`}>
            {isAuthenticated && !profileLoading && firstName && (
              <div className="mb-6">
                <p className="text-lg text-primary font-medium">
                  Bem-vindo de volta, {firstName}! 👋
                </p>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Seu <span className="text-primary">sorriso</span> é nossa 
              <span className="text-gradient bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> prioridade</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              {isAuthenticated 
                ? "Continue cuidando da sua saúde bucal com nossos especialistas em odontologia."
                : "Encontre os melhores dentistas e clínicas odontológicas perto de você. Agende sua consulta em minutos!"
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className={`bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold ${animations.buttonHover}`}
                onClick={() => window.location.href = '/schedule'}
              >
                <Calendar className="mr-2 h-5 w-5" />
                {isAuthenticated ? "Agendar Nova Consulta" : "Agendar Consulta"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className={`border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold ${animations.buttonHover}`}
                onClick={() => window.location.href = '/locations'}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Ver Clínicas
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-green-400 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">+2.000 pacientes atendidos</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">4.9/5 avaliação</span>
              </div>
            </div>
          </div>

          <div className={`relative ${animations.slideInRight}`}>
            <div className="relative">
              <img 
                src="/lovable-uploads/ca774d8a-1da5-4d35-a302-f23676e88e03.png" 
                alt="Dentista sorrindo" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              <Card className="absolute -bottom-6 -left-6 bg-white shadow-xl border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Atendimento 24h</p>
                      <p className="text-sm text-gray-600">Emergências odontológicas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="absolute -top-6 -right-6 bg-white shadow-xl border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Teleconsulta</p>
                      <p className="text-sm text-gray-600">Disponível</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
