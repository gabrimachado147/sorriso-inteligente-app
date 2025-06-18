
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Zap, 
  Trophy, 
  Clock, 
  Code, 
  Bug,
  Rocket,
  Award
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  timeLimit: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: 'Performance' | 'Debug' | 'Code Quality' | 'Innovation';
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export const DeveloperGamificationChallenge: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const challenges: Challenge[] = [
    {
      id: 'performance-boost',
      title: 'Performance Booster',
      description: 'Otimize um componente React para reduzir re-renders em 50%',
      points: 150,
      timeLimit: '2 horas',
      difficulty: 'Médio',
      category: 'Performance',
      completed: false,
      icon: Rocket
    },
    {
      id: 'bug-hunter',
      title: 'Caçador de Bugs',
      description: 'Encontre e corrija 5 bugs no código em menos de 1 hora',
      points: 200,
      timeLimit: '1 hora',
      difficulty: 'Difícil',
      category: 'Debug',
      completed: false,
      icon: Bug
    },
    {
      id: 'code-master',
      title: 'Mestre do Código Limpo',
      description: 'Refatore um componente complexo seguindo princípios SOLID',
      points: 100,
      timeLimit: '1.5 horas',
      difficulty: 'Fácil',
      category: 'Code Quality',
      completed: false,
      icon: Code
    },
    {
      id: 'innovation-spark',
      title: 'Centelha de Inovação',
      description: 'Implemente uma feature inovadora usando IA ou automação',
      points: 300,
      timeLimit: '3 horas',
      difficulty: 'Difícil',
      category: 'Innovation',
      completed: false,
      icon: Zap
    }
  ];

  const totalPoints = completedChallenges.reduce((sum, challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    return sum + (challenge?.points || 0);
  }, 0);

  const completionRate = (completedChallenges.length / challenges.length) * 100;

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-700 border-green-200';
      case 'Médio': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Difícil': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'Performance': return <Rocket className="h-4 w-4" />;
      case 'Debug': return <Bug className="h-4 w-4" />;
      case 'Code Quality': return <Code className="h-4 w-4" />;
      case 'Innovation': return <Zap className="h-4 w-4" />;
    }
  };

  const startChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    // Aqui você implementaria a lógica real do desafio
    console.log(`Iniciando desafio: ${challengeId}`);
  };

  const completeChallenge = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
      setSelectedChallenge(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Desafios de Desenvolvimento
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {totalPoints} pontos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedChallenges.length}</div>
              <div className="text-sm text-gray-600">Desafios Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Pontos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</div>
              <div className="text-sm text-gray-600">Taxa de Conclusão</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Desafios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((challenge) => {
          const IconComponent = challenge.icon;
          const isCompleted = completedChallenges.includes(challenge.id);
          const isActive = selectedChallenge === challenge.id;
          
          return (
            <Card
              key={challenge.id}
              className={`transition-all duration-200 hover:shadow-lg ${
                isCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : isActive 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'hover:border-gray-300'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </div>
                  {isCompleted && (
                    <Award className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{challenge.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(challenge.category)}
                    {challenge.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-primary" />
                      {challenge.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {challenge.timeLimit}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {isCompleted ? (
                    <Button disabled className="w-full">
                      ✅ Desafio Concluído
                    </Button>
                  ) : isActive ? (
                    <Button 
                      onClick={() => completeChallenge(challenge.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Concluído
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => startChallenge(challenge.id)}
                      variant="outline" 
                      className="w-full"
                    >
                      Iniciar Desafio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
