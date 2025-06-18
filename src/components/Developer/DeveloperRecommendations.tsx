
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Code,
  Database,
  Zap,
  Shield
} from 'lucide-react';

export const DeveloperRecommendations: React.FC = () => {
  const recommendations = [
    {
      type: 'performance',
      priority: 'high',
      title: 'Otimização de Componentes',
      description: 'Alguns componentes podem ser otimizados com React.memo',
      impact: 'Melhoria de 20% na performance',
      icon: Zap,
      color: 'orange'
    },
    {
      type: 'security',
      priority: 'medium',
      title: 'Atualizar Dependências',
      description: '3 dependências têm atualizações de segurança disponíveis',
      impact: 'Melhoria na segurança',
      icon: Shield,
      color: 'red'
    },
    {
      type: 'code-quality',
      priority: 'low',
      title: 'Refatoração de Hooks',
      description: 'Alguns hooks customizados podem ser simplificados',
      impact: 'Melhor manutenibilidade',
      icon: Code,
      color: 'blue'
    },
    {
      type: 'database',
      priority: 'medium',
      title: 'Otimizar Queries',
      description: 'Algumas queries do Supabase podem ser otimizadas',
      impact: 'Redução de 30% no tempo de resposta',
      icon: Database,
      color: 'green'
    }
  ];

  const bestPractices = [
    {
      title: 'Lazy Loading',
      description: 'Implementado corretamente em todas as páginas',
      status: 'implemented',
      icon: CheckCircle
    },
    {
      title: 'Error Boundaries',
      description: 'Configurados para capturar erros de componentes',
      status: 'implemented',
      icon: CheckCircle
    },
    {
      title: 'PWA Features',
      description: 'Service Worker e manifest configurados',
      status: 'implemented',
      icon: CheckCircle
    },
    {
      title: 'TypeScript Strict',
      description: 'Modo strict ativado para melhor type safety',
      status: 'recommended',
      icon: AlertTriangle
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'orange': return 'text-orange-600';
      case 'red': return 'text-red-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recomendações Ativas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium">Recomendações Ativas</h3>
        </div>
        
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(rec.color)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)} variant="outline">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-700">{rec.impact}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Melhores Práticas */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Status das Melhores Práticas
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {bestPractices.map((practice, index) => {
            const Icon = practice.icon;
            const isImplemented = practice.status === 'implemented';
            
            return (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isImplemented ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isImplemented ? 'text-green-600' : 'text-yellow-600'}`} />
                  <div>
                    <h5 className="text-sm font-medium">{practice.title}</h5>
                    <p className="text-xs text-muted-foreground">{practice.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={isImplemented ? "default" : "secondary"}
                  className={isImplemented ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                >
                  {isImplemented ? 'Implementado' : 'Recomendado'}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métricas de Qualidade */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Métricas de Qualidade do Código</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-xs text-muted-foreground">Cobertura de Testes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">A+</div>
              <div className="text-xs text-muted-foreground">Qualidade do Código</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-xs text-muted-foreground">Performance Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-xs text-muted-foreground">Acessibilidade</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
