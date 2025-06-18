
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Trophy
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
}

export const DeveloperTutorialGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'setup',
      title: 'Configuração Inicial',
      description: 'Configure seu ambiente de desenvolvimento e conecte ao Supabase',
      duration: '5 min',
      completed: false,
      difficulty: 'Básico'
    },
    {
      id: 'analysis',
      title: 'Análise de Código AI',
      description: 'Aprenda a usar o sistema de análise inteligente de código',
      duration: '10 min',
      completed: false,
      difficulty: 'Intermediário'
    },
    {
      id: 'optimization',
      title: 'Otimizações Avançadas',
      description: 'Implemente otimizações de performance e segurança',
      duration: '15 min',
      completed: false,
      difficulty: 'Avançado'
    },
    {
      id: 'deployment',
      title: 'Deploy e Monitoramento',
      description: 'Configure deploy automático e monitoramento de performance',
      duration: '12 min',
      completed: false,
      difficulty: 'Intermediário'
    }
  ];

  const progress = (completedSteps.length / tutorialSteps.length) * 100;

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const getDifficultyColor = (difficulty: TutorialStep['difficulty']) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          Guia Interativo de Desenvolvimento
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {completedSteps.length}/{tutorialSteps.length} Concluídos
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Geral</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tutorialSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isCurrent 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="font-medium">{step.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(step.difficulty)}
                    >
                      {step.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">⏱️ {step.duration}</span>
                    {isCurrent && (
                      <Button
                        size="sm"
                        onClick={() => markStepCompleted(step.id)}
                        className="text-xs"
                      >
                        Marcar como Concluído
                        <CheckCircle className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                {isCurrent && (
                  <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
                )}
              </div>
            </div>
          );
        })}

        {progress === 100 && (
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-2">🎉 Parabéns!</h3>
            <p className="text-gray-600">
              Você completou todos os tutoriais e está pronto para dominar as ferramentas de desenvolvimento!
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
