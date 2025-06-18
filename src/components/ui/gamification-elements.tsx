
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Award, Clock } from 'lucide-react';
import { animations } from '@/lib/animations';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface GamificationStatsProps {
  userLevel?: number;
  userPoints?: number;
  nextLevelPoints?: number;
  achievements?: Achievement[];
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({
  userLevel = 3,
  userPoints = 750,
  nextLevelPoints = 1000,
  achievements = []
}) => {
  const defaultAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Primeira Consulta',
      description: 'Complete sua primeira consulta',
      icon: Star,
      unlocked: true
    },
    {
      id: '2',
      title: 'Pontual',
      description: 'Chegue no horário em 5 consultas',
      icon: Clock,
      unlocked: true,
      progress: 5,
      total: 5
    },
    {
      id: '3',
      title: 'Cliente Fiel',
      description: 'Complete 10 consultas',
      icon: Trophy,
      unlocked: false,
      progress: 7,
      total: 10
    },
    {
      id: '4',
      title: 'Recomendador',
      description: 'Indique 3 amigos',
      icon: Award,
      unlocked: false,
      progress: 1,
      total: 3
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;
  const levelProgress = (userPoints / nextLevelPoints) * 100;

  return (
    <div className="space-y-4">
      {/* Level and Points */}
      <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-blue/5 ${animations.scaleIn}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nível Atual</p>
              <p className="text-2xl font-bold text-primary">{userLevel}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {userPoints} pts
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso para o próximo nível</span>
              <span>{userPoints}/{nextLevelPoints}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className={animations.fadeInUp}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayAchievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <div 
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                } ${animations.slideInLeft}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-2 rounded-full ${
                  achievement.unlocked 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    achievement.unlocked ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {achievement.description}
                  </p>
                  
                  {achievement.progress !== undefined && achievement.total && (
                    <div className="mt-1">
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-1"
                      />
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                  )}
                </div>
                
                {achievement.unlocked && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
