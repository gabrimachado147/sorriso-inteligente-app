
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Code,
  Database,
  Zap,
  Shield,
  Star,
  Target,
  ArrowUp,
  Clock,
  Users,
  Globe,
  Smartphone,
  Info,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DeveloperRecommendations: React.FC = () => {
  const [implementingId, setImplementingId] = useState<number | null>(null);
  const [implementedIds, setImplementedIds] = useState<number[]>([]);
  const { toast } = useToast();

  const criticalRecommendations = [
    {
      id: 1,
      type: 'performance',
      priority: 'high',
      title: 'Implementar Code Splitting Avançado',
      description: 'Dividir o bundle em chunks menores por rota e funcionalidade',
      impact: 'Redução de 40% no tempo de carregamento inicial',
      effort: 'Alto',
      timeline: '2-3 dias',
      icon: Zap,
      color: 'red',
      currentScore: 65,
      targetScore: 90,
      detailedSteps: [
        'Implementar React.lazy() para componentes de página',
        'Configurar Webpack code splitting por rotas',
        'Adicionar prefetch para chunks críticos',
        'Otimizar imports dinâmicos'
      ],
      codeExample: `// Exemplo de implementação
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  );
}`
    },
    {
      id: 2,
      type: 'security',
      priority: 'high',
      title: 'Atualizar Dependências Críticas',
      description: '8 dependências com vulnerabilidades de segurança conhecidas',
      impact: 'Eliminação de riscos de segurança',
      effort: 'Médio',
      timeline: '1 dia',
      icon: Shield,
      color: 'red',
      currentScore: 75,
      targetScore: 95,
      detailedSteps: [
        'Executar npm audit para identificar vulnerabilidades',
        'Atualizar dependências críticas uma por vez',
        'Testar funcionalidades após cada atualização',
        'Documentar mudanças de breaking changes'
      ],
      codeExample: `# Comandos para execução
npm audit
npm audit fix
npm update
npm install package@latest`
    },
    {
      id: 3,
      type: 'architecture',
      priority: 'medium',
      title: 'Refatorar Context API',
      description: 'Dividir contextos grandes em contextos específicos',
      impact: 'Melhoria de 25% na performance de rendering',
      effort: 'Alto',
      timeline: '3-4 dias',
      icon: Code,
      color: 'orange',
      currentScore: 70,
      targetScore: 85,
      detailedSteps: [
        'Identificar contextos com muitas responsabilidades',
        'Criar contextos específicos por domínio',
        'Implementar Context Providers compostos',
        'Migrar componentes gradualmente'
      ],
      codeExample: `// Exemplo de contexto específico
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Em vez de um AppContext gigante`
    },
    {
      id: 4,
      type: 'database',
      priority: 'medium',
      title: 'Otimizar Queries N+1',
      description: 'Implementar joins e eager loading em queries relacionadas',
      impact: 'Redução de 60% no tempo de resposta da API',
      effort: 'Médio',
      timeline: '2 dias',
      icon: Database,
      color: 'orange',
      currentScore: 60,
      targetScore: 90,
      detailedSteps: [
        'Identificar queries com problema N+1',
        'Implementar joins no Supabase',
        'Adicionar eager loading',
        'Monitorar performance das queries'
      ],
      codeExample: `// Exemplo de otimização
const { data } = await supabase
  .from('appointments')
  .select(\`
    *,
    clinics (*),
    users (*)
  \`)
  .limit(10);`
    },
    {
      id: 5,
      type: 'ux',
      priority: 'low',
      title: 'Implementar Skeleton Loading',
      description: 'Adicionar estados de carregamento para melhor UX',
      impact: 'Melhoria significativa na percepção de performance',
      effort: 'Baixo',
      timeline: '1 dia',
      icon: Users,
      color: 'green',
      currentScore: 80,
      targetScore: 95,
      detailedSteps: [
        'Criar componentes de Skeleton',
        'Identificar pontos de carregamento',
        'Implementar progressivamente',
        'Testar em diferentes velocidades de conexão'
      ],
      codeExample: `// Componente Skeleton
const Skeleton = ({ className }) => (
  <div className={\`animate-pulse bg-gray-200 rounded \${className}\`} />
);

// Uso
{loading ? <Skeleton className="h-4 w-full" /> : <Content />}`
    }
  ];

  const handleImplement = async (recommendation: typeof criticalRecommendations[0]) => {
    setImplementingId(recommendation.id);
    
    // Simular implementação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setImplementedIds(prev => [...prev, recommendation.id]);
    setImplementingId(null);
    
    toast({
      title: "Implementação Iniciada",
      description: `${recommendation.title} foi adicionado à fila de implementação.`,
    });
  };

  const quickWins = [
    {
      title: 'Adicionar React.memo em ListComponents',
      effort: '30 min',
      impact: 'Médio',
      type: 'performance'
    },
    {
      title: 'Configurar Error Boundaries',
      effort: '1 hora',
      impact: 'Alto',
      type: 'reliability'
    },
    {
      title: 'Implementar Service Worker',
      effort: '2 horas',
      impact: 'Alto',
      type: 'pwa'
    },
    {
      title: 'Otimizar Imagens WebP',
      effort: '45 min',
      impact: 'Médio',
      type: 'performance'
    },
    {
      title: 'Adicionar Meta Tags SEO',
      effort: '1 hora',
      impact: 'Alto',
      type: 'seo'
    }
  ];

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      items: [
        'Migração para Next.js 14',
        'Implementação de Micro-frontends',
        'Sistema de Design Tokens'
      ],
      status: 'planning'
    },
    {
      quarter: 'Q2 2024',
      items: [
        'GraphQL Federation',
        'Real-time com WebSockets',
        'Internacionalização (i18n)'
      ],
      status: 'development'
    },
    {
      quarter: 'Q3 2024',
      items: [
        'Machine Learning Integration',
        'Advanced Analytics',
        'Mobile App (React Native)'
      ],
      status: 'future'
    }
  ];

  const metrics = {
    codeQuality: 87,
    performance: 92,
    security: 88,
    maintainability: 85,
    testCoverage: 94,
    accessibility: 91
  };

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
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      case 'green': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-purple-600" />
          Recomendações Inteligentes
        </h2>
        <Badge className="bg-purple-100 text-purple-700">
          <Star className="h-3 w-3 mr-1" />
          IA Powered
        </Badge>
      </div>

      <Tabs defaultValue="critical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="critical">Críticas</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-4">
          {criticalRecommendations.map((rec, index) => {
            const Icon = rec.icon;
            const progressValue = (rec.currentScore / rec.targetScore) * 100;
            const isImplementing = implementingId === rec.id;
            const isImplemented = implementedIds.includes(rec.id);
            
            return (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon className={`h-6 w-6 mt-1 ${getIconColor(rec.color)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-lg">{rec.title}</h3>
                          <Badge className={getPriorityColor(rec.priority)} variant="outline">
                            {rec.priority}
                          </Badge>
                          {isImplemented && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Implementado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-green-700">Impacto Esperado</div>
                            <div className="text-sm">{rec.impact}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-blue-700">Esforço</div>
                            <div className="text-sm">{rec.effort} - {rec.timeline}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-purple-700">Progresso</div>
                            <div className="space-y-1">
                              <Progress value={progressValue} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                {rec.currentScore}/{rec.targetScore}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleImplement(rec)}
                        disabled={isImplementing || isImplemented}
                      >
                        {isImplementing ? (
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                        ) : isImplemented ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        )}
                        {isImplementing ? 'Implementando...' : isImplemented ? 'Implementado' : 'Implementar'}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Info className="h-3 w-3 mr-1" />
                            Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon className={`h-5 w-5 ${getIconColor(rec.color)}`} />
                              {rec.title}
                            </DialogTitle>
                            <DialogDescription>
                              {rec.description}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Impacto:</strong> {rec.impact}<br />
                                <strong>Esforço:</strong> {rec.effort} ({rec.timeline})<br />
                                <strong>Prioridade:</strong> {rec.priority}
                              </AlertDescription>
                            </Alert>

                            <div>
                              <h4 className="font-medium mb-2">Passos de Implementação:</h4>
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                {rec.detailedSteps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Exemplo de Código:</h4>
                              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                <code>{rec.codeExample}</code>
                              </pre>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-muted-foreground">
                                Progresso atual: {rec.currentScore}/{rec.targetScore}
                              </div>
                              <Progress value={progressValue} className="w-32 h-2" />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickWins.map((win, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{win.title}</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Quick Win
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {win.effort}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {win.impact}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Play className="h-3 w-3 mr-1" />
                    Implementar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Impacto Acumulado dos Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+15%</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+20%</div>
                  <div className="text-xs text-muted-foreground">UX Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">+25%</div>
                  <div className="text-xs text-muted-foreground">SEO</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">6h</div>
                  <div className="text-xs text-muted-foreground">Tempo Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          {roadmapItems.map((quarter, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{quarter.quarter}</span>
                  <Badge 
                    variant="secondary" 
                    className={
                      quarter.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                      quarter.status === 'development' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {quarter.status === 'planning' ? 'Planejamento' :
                     quarter.status === 'development' ? 'Desenvolvimento' : 'Futuro'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quarter.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([key, value]) => {
              const labels = {
                codeQuality: 'Qualidade do Código',
                performance: 'Performance',
                security: 'Segurança',
                maintainability: 'Manutenibilidade',
                testCoverage: 'Cobertura de Testes',
                accessibility: 'Acessibilidade'
              };
              
              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{labels[key as keyof typeof labels]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{value}%</span>
                        <Badge 
                          variant="secondary" 
                          className={value >= 90 ? 'bg-green-100 text-green-700' : 
                                   value >= 80 ? 'bg-yellow-100 text-yellow-700' : 
                                   'bg-red-100 text-red-700'}
                        >
                          {value >= 90 ? 'Excelente' : value >= 80 ? 'Bom' : 'Requer Atenção'}
                        </Badge>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Benchmarks da Indústria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Seu Projeto</span>
                  <Badge className="bg-purple-100 text-purple-700">89% (Acima da Média)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Média da Indústria</span>
                  <span className="text-sm text-muted-foreground">76%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Top 10% do Mercado</span>
                  <span className="text-sm text-muted-foreground">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
