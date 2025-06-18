
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Zap, Target, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MicroInteraction } from './micro-interactions';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  points: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationStatsProps {
  className?: string;
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({ className }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 150,
    experienceToNextLevel: 300,
    totalPoints: 1250,
    achievementsUnlocked: 3,
    totalAchievements: 12
  });

  const progressPercentage = (userStats.experience / userStats.experienceToNextLevel) * 100;

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    rare: 'bg-blue-100 text-blue-700 border-blue-300',
    epic: 'bg-purple-100 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primeiro Agendamento',
      description: 'Fez seu primeiro agendamento!',
      icon: Star,
      points: 100,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Explorador do Chat',
      description: 'Usou o chat IA pela primeira vez',
      icon: Zap,
      points: 150,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '3',
      title: 'Navegador Expert',
      description: 'Explorou todas as páginas principais',
      icon: Target,
      points: 200,
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Mestre do Feedback',
      description: 'Forneceu feedback em 5 páginas diferentes',
      icon: Trophy,
      points: 500,
      unlocked: false,
      rarity: 'epic'
    }
  ];

  return (
    <Card className={cn('border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50', className)}>
      <CardContent className="p-4 space-y-4">
        {/* Status do usuário */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Nível {userStats.level}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userStats.totalPoints} pontos totais
            </p>
          </div>
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            {userStats.achievementsUnlocked}/{userStats.totalAchievements} conquistas
          </Badge>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experiência</span>
            <span>{userStats.experience}/{userStats.experienceToNextLevel}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Conquistas recentes */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Conquistas Recentes
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <MicroInteraction key={achievement.id} type="hover-lift" trigger="hover">
                  <div className={cn(
                    'p-2 rounded-lg border text-center text-xs',
                    rarityColors[achievement.rarity]
                  )}>
                    <IconComponent className="h-4 w-4 mx-auto mb-1" />
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-xs opacity-75">+{achievement.points} pts</div>
                  </div>
                </MicroInteraction>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook para gerenciar pontuação de gamificação
export const useGamification = () => {
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => prev + amount);
    
    // Salvar no localStorage
    const currentPoints = parseInt(localStorage.getItem('user_points') || '0');
    localStorage.setItem('user_points', (currentPoints + amount).toString());
    
    console.log(`🎮 Gamificação: +${amount} pontos por ${reason}`);
  };

  const unlockAchievement = (achievementId: string) => {
    if (!achievements.includes(achievementId)) {
      setAchievements(prev => [...prev, achievementId]);
      
      // Salvar no localStorage
      const currentAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
      currentAchievements.push(achievementId);
      localStorage.setItem('user_achievements', JSON.stringify(currentAchievements));
      
      console.log(`🏆 Nova conquista desbloqueada: ${achievementId}`);
    }
  };

  return {
    points,
    achievements,
    addPoints,
    unlockAchievement
  };
};
