
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Star, Flame, Award, Target } from 'lucide-react';

export const GamificationDashboard: React.FC = () => {
  const { data, getProgressToNextLevel } = useGamification();

  const levelProgress = getProgressToNextLevel();

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{data.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Pontos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{data.level}</div>
              <div className="text-sm text-muted-foreground">Nível</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{data.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Sequência Atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{data.badges.filter(b => b.earned).length}</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso para o Nível {data.level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {data.nextLevelPoints - data.totalPoints} pontos para o próximo nível
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border ${
                  badge.earned
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {badge.description}
                    </div>
                    {badge.earned && badge.earnedAt && (
                      <div className="text-xs text-primary mt-1">
                        Conquistado em {badge.earnedAt.toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                  {badge.earned && (
                    <Badge variant="secondary" className="text-xs">
                      Conquistado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {data.recentAchievements.slice(0, 5).map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{achievement.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.date.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    +{achievement.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Agende sua primeira consulta para começar a ganhar pontos!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak */}
      {data.currentStreak > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <div className="font-medium">Você está em chamas! 🔥</div>
                <div className="text-sm text-muted-foreground">
                  {data.currentStreak} consultas consecutivas realizadas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
