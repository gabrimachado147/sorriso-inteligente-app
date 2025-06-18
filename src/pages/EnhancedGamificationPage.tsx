
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { MicroInteraction } from '@/components/ui/micro-interactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Gift, Zap, Medal, Crown, Award } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'engagement' | 'health' | 'social' | 'milestone';
}

const EnhancedGamificationPage = () => {
  const [userLevel, setUserLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(750);
  const [nextLevelXP] = useState(1000);
  const [totalPoints, setTotalPoints] = useState(2450);
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Gamificação', href: '/gamification', icon: Trophy }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-appointment',
      title: 'Primeiro Passo',
      description: 'Agendou sua primeira consulta',
      icon: Star,
      points: 100,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'common',
      category: 'milestone'
    },
    {
      id: 'dental-champion',
      title: 'Campeão Dental',
      description: 'Completou 10 consultas de rotina',
      icon: Trophy,
      points: 500,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      rarity: 'epic',
      category: 'health'
    },
    {
      id: 'social-butterfly',
      title: 'Borboleta Social',
      description: 'Compartilhou 5 experiências',
      icon: Medal,
      points: 250,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare',
      category: 'social'
    },
    {
      id: 'chat-explorer',
      title: 'Explorador do Chat',
      description: 'Interagiu com a IA 20 vezes',
      icon: Zap,
      points: 300,
      unlocked: true,
      progress: 20,
      maxProgress: 20,
      rarity: 'rare',
      category: 'engagement'
    },
    {
      id: 'loyalty-legend',
      title: 'Lenda da Fidelidade',
      description: 'Cliente há mais de 2 anos',
      icon: Crown,
      points: 1000,
      unlocked: false,
      progress: 18,
      maxProgress: 24,
      rarity: 'legendary',
      category: 'milestone'
    },
    {
      id: 'feedback-master',
      title: 'Mestre do Feedback',
      description: 'Avaliou 15 consultas',
      icon: Award,
      points: 400,
      unlocked: false,
      progress: 12,
      maxProgress: 15,
      rarity: 'epic',
      category: 'engagement'
    }
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    rare: 'bg-blue-100 text-blue-700 border-blue-300',
    epic: 'bg-purple-100 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };

  const categoryColors = {
    engagement: 'bg-green-500',
    health: 'bg-blue-500',
    social: 'bg-pink-500',
    milestone: 'bg-orange-500'
  };

  const progressPercentage = (currentXP / nextLevelXP) * 100;

  const claimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.unlocked) {
      setTotalPoints(prev => prev + achievement.points);
      toast({
        title: "Recompensa coletada! 🎉",
        description: `Você ganhou ${achievement.points} pontos!`,
      });
    }
  };

  const leaderboard = [
    { name: 'Você', points: totalPoints, position: 3, avatar: '👤' },
    { name: 'Maria Silva', points: 3200, position: 1, avatar: '👩' },
    { name: 'João Santos', points: 2800, position: 2, avatar: '👨' },
    { name: 'Ana Costa', points: 2100, position: 4, avatar: '👩' },
    { name: 'Carlos Lima', points: 1950, position: 5, avatar: '👨' }
  ].sort((a, b) => b.points - a.points);

  return (
    <>
      <PageHead
        title="Gamificação - Senhor Sorriso"
        description="Acompanhe seu progresso, conquiste medalhas e ganhe recompensas pelo seu cuidado com a saúde bucal."
        keywords="gamificação, conquistas, medalhas, pontos, recompensas, progresso, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/gamification"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    Sistema de Recompensas
                  </h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Ganhe pontos, desbloqueie conquistas e acompanhe seu progresso 
                    no cuidado com a saúde bucal!
                  </p>
                </div>

                {/* Status do Usuário */}
                <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                              <Crown className="h-8 w-8 text-white" />
                            </div>
                            <Badge className="absolute -top-1 -right-1 bg-purple-500 text-white">
                              {userLevel}
                            </Badge>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">Nível {userLevel}</h2>
                            <p className="text-gray-600">{totalPoints.toLocaleString()} pontos totais</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso para o próximo nível</span>
                            <span>{currentXP}/{nextLevelXP} XP</span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Conquistas */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Suas Conquistas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {achievements.map((achievement) => {
                            const IconComponent = achievement.icon;
                            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
                            
                            return (
                              <MicroInteraction key={achievement.id} type="hover-lift" trigger="hover">
                                <Card className={cn(
                                  'p-4 transition-all duration-200',
                                  achievement.unlocked 
                                    ? 'border-green-300 bg-green-50 shadow-md' 
                                    : 'border-gray-200 bg-gray-50'
                                )}>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={cn(
                                          'p-2 rounded-lg',
                                          achievement.unlocked ? 'bg-green-200' : 'bg-gray-200'
                                        )}>
                                          <IconComponent className={cn(
                                            'h-5 w-5',
                                            achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                                          )} />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                                          <p className="text-xs text-gray-600">{achievement.description}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-col items-end gap-1">
                                        <Badge className={cn('text-xs', rarityColors[achievement.rarity])}>
                                          {achievement.rarity}
                                        </Badge>
                                        <span className="text-xs font-bold text-green-600">
                                          +{achievement.points}
                                        </span>
                                      </div>
                                    </div>

                                    {!achievement.unlocked && (
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span>Progresso</span>
                                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                                        </div>
                                        <Progress value={progressPercent} className="h-2" />
                                      </div>
                                    )}

                                    {achievement.unlocked && (
                                      <MicroInteraction type="click-ripple" trigger="click">
                                        <Button 
                                          size="sm" 
                                          className="w-full"
                                          onClick={() => claimReward(achievement.id)}
                                        >
                                          <Gift className="h-3 w-3 mr-1" />
                                          Coletado ✓
                                        </Button>
                                      </MicroInteraction>
                                    )}
                                  </div>
                                </Card>
                              </MicroInteraction>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Ranking e Feedback */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Ranking */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Medal className="h-5 w-5 text-primary" />
                          Ranking Mensal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {leaderboard.map((user, index) => (
                            <MicroInteraction key={index} type="hover-lift" trigger="hover">
                              <div className={cn(
                                'flex items-center justify-between p-3 rounded-lg border',
                                user.name === 'Você' 
                                  ? 'bg-blue-50 border-blue-200' 
                                  : 'bg-white border-gray-200'
                              )}>
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                    index === 0 ? 'bg-yellow-400 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                    index === 2 ? 'bg-orange-400 text-white' :
                                    'bg-gray-200 text-gray-700'
                                  )}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-600">{user.points} pontos</p>
                                  </div>
                                </div>
                                {index < 3 && (
                                  <Badge className={cn(
                                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                    'bg-orange-100 text-orange-700'
                                  )}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </Badge>
                                )}
                              </div>
                            </MicroInteraction>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Feedback */}
                    <FeedbackSystem 
                      pageContext="Sistema de Gamificação"
                      onSubmit={(feedback) => {
                        console.log('Feedback Gamificação:', feedback);
                      }}
                    />
                  </div>
                </div>

                {/* Dicas de Gamificação */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-green-900 mb-3">🎮 Como ganhar mais pontos:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <h4 className="font-medium mb-2">📅 Agendamentos Regulares</h4>
                        <p>Mantenha suas consultas em dia para ganhar pontos de consistência</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">💬 Interaja com o Chat IA</h4>
                        <p>Tire dúvidas e receba orientações para desbloquear conquistas</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">⭐ Avalie suas Consultas</h4>
                        <p>Compartilhe sua experiência para ajudar outros pacientes</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🔔 Configure Lembretes</h4>
                        <p>Use o sistema de lembretes para não perder compromissos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedGamificationPage;
