
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { GamificationStats } from '@/components/ui/gamification-elements';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { 
  Trophy,
  Star,
  Target,
  Gift,
  Crown,
  Zap,
  Users,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { animations } from '@/lib/animations';

const EnhancedGamificationPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Gamificação', href: '/gamification', icon: Trophy, current: true }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Primeira Consulta',
      description: 'Complete sua primeira consulta odontológica',
      reward: '50 pontos',
      progress: 100,
      total: 100,
      completed: true,
      icon: Star
    },
    {
      id: 2,
      title: 'Pontualidade Master',
      description: 'Chegue no horário em 5 consultas consecutivas',
      reward: '100 pontos + Badge',
      progress: 3,
      total: 5,
      completed: false,
      icon: Target
    },
    {
      id: 3,
      title: 'Cliente do Mês',
      description: 'Realize 3 procedimentos em 30 dias',
      reward: '200 pontos + Desconto',
      progress: 1,
      total: 3,
      completed: false,
      icon: Crown
    },
    {
      id: 4,
      title: 'Embaixador Sorriso',
      description: 'Indique 3 amigos que realizem consultas',
      reward: '300 pontos + Brinde',
      progress: 0,
      total: 3,
      completed: false,
      icon: Users
    }
  ];

  const rewards = [
    {
      title: 'Desconto 10%',
      cost: '500 pontos',
      description: 'Desconto em qualquer procedimento',
      category: 'Desconto',
      available: true
    },
    {
      title: 'Limpeza Grátis',
      cost: '800 pontos',
      description: 'Uma sessão de limpeza gratuita',
      category: 'Serviço',
      available: true
    },
    {
      title: 'Kit Higiene Premium',
      cost: '1000 pontos',
      description: 'Kit completo com produtos premium',
      category: 'Produto',
      available: false
    },
    {
      title: 'Consulta VIP',
      cost: '1500 pontos',
      description: 'Atendimento prioritário e diferenciado',
      category: 'Experiência',
      available: false
    }
  ];

  const leaderboard = [
    { position: 1, name: 'Maria Silva', points: 2350, badge: 'Diamante' },
    { position: 2, name: 'João Santos', points: 2100, badge: 'Ouro' },
    { position: 3, name: 'Ana Costa', points: 1890, badge: 'Ouro' },
    { position: 4, name: 'Pedro Lima', points: 1650, badge: 'Prata' },
    { position: 5, name: 'Você', points: 750, badge: 'Bronze' }
  ];

  const handleClaimReward = (reward: any) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <PageHead
        title="Sistema de Gamificação - Senhor Sorriso"
        description="Participe do nosso sistema de recompensas! Ganhe pontos, complete desafios e troque por benefícios exclusivos."
        keywords="gamificação, pontos, recompensas, desafios, benefícios, programa fidelidade, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/gamification"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    Sistema de Recompensas
                  </h1>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Complete desafios, ganhe pontos e troque por benefícios exclusivos! 
                    Transforme sua jornada odontológica em uma experiência gamificada.
                  </p>
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar com Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <GamificationStats />
                    
                    <FeedbackSystem 
                      pageContext="Sistema de Gamificação"
                      onSubmit={(feedback) => {
                        console.log('Feedback Gamificação:', feedback);
                      }}
                    />
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="challenges" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="challenges" className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="hidden sm:inline">Desafios</span>
                        </TabsTrigger>
                        <TabsTrigger value="rewards" className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          <span className="hidden sm:inline">Recompensas</span>
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span className="hidden sm:inline">Ranking</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="hidden sm:inline">Histórico</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Desafios */}
                      <TabsContent value="challenges">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Desafios Ativos</h2>
                            <Badge variant="secondary">
                              {challenges.filter(c => !c.completed).length} ativos
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.map((challenge, index) => {
                              const IconComponent = challenge.icon;
                              
                              return (
                                <Card 
                                  key={challenge.id}
                                  className={`${animations.scaleIn} ${
                                    challenge.completed 
                                      ? 'border-green-200 bg-green-50' 
                                      : 'border-primary/20 hover:shadow-lg transition-all duration-300'
                                  }`}
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                          challenge.completed 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-primary/10 text-primary'
                                        }`}>
                                          <IconComponent className="h-5 w-5" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                                          {challenge.completed && (
                                            <Badge className="mt-1 bg-green-500">
                                              ✓ Concluído
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <p className="text-gray-600 text-sm">
                                      {challenge.description}
                                    </p>
                                    
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Progresso</span>
                                        <span>{challenge.progress}/{challenge.total}</span>
                                      </div>
                                      <Progress 
                                        value={(challenge.progress / challenge.total) * 100} 
                                        className="h-2"
                                      />
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-yellow-600" />
                                        <span className="font-medium text-yellow-700">
                                          {challenge.reward}
                                        </span>
                                      </div>
                                      
                                      {challenge.completed && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                          Resgatar
                                        </Button>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Recompensas */}
                      <TabsContent value="rewards">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Loja de Recompensas</h2>
                            <div className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-yellow-600" />
                              <span className="font-bold text-primary">750 pontos disponíveis</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rewards.map((reward, index) => (
                              <Card 
                                key={reward.title}
                                className={`${animations.fadeInUp} ${
                                  reward.available 
                                    ? 'hover:shadow-lg transition-all duration-300' 
                                    : 'opacity-60'
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                                      <Badge variant="outline" className="mt-1">
                                        {reward.category}
                                      </Badge>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-primary">{reward.cost}</p>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <p className="text-gray-600 text-sm">
                                    {reward.description}
                                  </p>
                                  
                                  <Button 
                                    className="w-full"
                                    disabled={!reward.available}
                                    onClick={() => handleClaimReward(reward)}
                                  >
                                    {reward.available ? 'Resgatar' : 'Pontos Insuficientes'}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Ranking */}
                      <TabsContent value="leaderboard">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Crown className="h-5 w-5 text-yellow-600" />
                              Ranking dos Campeões
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              Os usuários com mais pontos este mês
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {leaderboard.map((user, index) => (
                                <div 
                                  key={user.position}
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                                    user.name === 'Você' 
                                      ? 'bg-primary/10 border border-primary/20' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  } ${animations.slideInLeft}`}
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    user.position === 1 ? 'bg-yellow-500 text-white' :
                                    user.position === 2 ? 'bg-gray-400 text-white' :
                                    user.position === 3 ? 'bg-amber-600 text-white' :
                                    'bg-gray-200 text-gray-700'
                                  }`}>
                                    {user.position}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <h4 className="font-medium">{user.name}</h4>
                                    <p className="text-sm text-gray-600">{user.points} pontos</p>
                                  </div>
                                  
                                  <Badge variant="secondary">
                                    {user.badge}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Histórico */}
                      <TabsContent value="history">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-primary" />
                              Histórico de Atividades
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Seu histórico de pontos e recompensas aparecerá aqui.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>

      <SuccessAnimation
        show={showSuccess}
        message="Recompensa resgatada com sucesso!"
      />
    </>
  );
};

export default EnhancedGamificationPage;
