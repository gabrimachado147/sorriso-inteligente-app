
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Clock, Users } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';

interface HeroSectionProps {
  onScheduleClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScheduleClick }) => {
  const { user, isAuthenticated } = useAuth();

  const stats = [
    { icon: Users, label: 'Pacientes Atendidos', value: '10.000+' },
    { icon: Star, label: 'Satisfação', value: '98%' },
    { icon: Clock, label: 'Anos de Experiência', value: '15+' },
    { icon: Calendar, label: 'Consultas/Mês', value: '500+' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {isAuthenticated && user ? (
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${animations.fadeIn}`}>
              Bem-vindo de volta, {user.user_metadata?.nome_completo || user.email?.split('@')[0] || 'usuário'}!
            </h1>
          ) : (
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${animations.fadeIn}`}>
              Seu Sorriso é Nossa Prioridade
            </h1>
          )}
          
          <p className={`text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto ${animations.fadeIn}`}
             style={{ animationDelay: '200ms' }}>
            Cuidado odontológico de excelência com tecnologia avançada e atendimento humanizado
          </p>
          
          {onScheduleClick && (
            <Button 
              onClick={onScheduleClick}
              size="lg"
              className={`bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 ${animations.fadeIn}`}
              style={{ animationDelay: '400ms' }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Consulta
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                className={`bg-white/10 backdrop-blur-lg border-white/20 text-white ${animations.fadeIn}`}
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
