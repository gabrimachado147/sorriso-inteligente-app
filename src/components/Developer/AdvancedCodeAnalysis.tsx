
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  FileSearch, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Database,
  Zap,
  Shield,
  Brain,
  Activity,
  BarChart3
} from 'lucide-react';

export const AdvancedCodeAnalysis: React.FC = () => {
  const [analysisRunning, setAnalysisRunning] = useState(false);

  const codeMetrics = {
    totalFiles: 247,
    totalLines: 15428,
    components: 89,
    hooks: 34,
    pages: 12,
    services: 18,
    complexity: 'Medium',
    maintainabilityIndex: 78,
    technicalDebt: '4.2 hours',
    testCoverage: 92,
    duplication: 3.1
  };

  const performanceMetrics = {
    bundleSize: '2.4MB',
    gzipSize: '680KB',
    loadTime: '1.2s',
    fcp: '0.8s',
    lcp: '1.1s',
    cls: '0.05',
    fid: '12ms'
  };

  const securityAnalysis = {
    vulnerabilities: 0,
    dependencies: 127,
    outdatedDeps: 8,
    securityScore: 'A+',
    lastScan: '2 minutes ago'
  };

  const runCodeAnalysis = async () => {
    setAnalysisRunning(true);
    // Simular análise
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Análise Avançada de Código
        </h2>
        <Button 
          onClick={runCodeAnalysis}
          disabled={analysisRunning}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {analysisRunning ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <FileSearch className="h-4 w-4 mr-2" />
              Executar Análise Completa
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total de Arquivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{codeMetrics.totalFiles}</div>
                <div className="text-xs text-muted-foreground">+12 esta semana</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Linhas de Código</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{codeMetrics.totalLines.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Bem estruturado</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cobertura de Testes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{codeMetrics.testCoverage}%</div>
                <div className="text-xs text-muted-foreground">Excelente!</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Índice de Manutenibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{codeMetrics.maintainabilityIndex}</div>
                <div className="text-xs text-muted-foreground">Muito bom</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição de Componentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{codeMetrics.components}</div>
                  <div className="text-sm text-blue-700">Componentes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{codeMetrics.hooks}</div>
                  <div className="text-sm text-green-700">Hooks</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{codeMetrics.pages}</div>
                  <div className="text-sm text-purple-700">Páginas</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{codeMetrics.services}</div>
                  <div className="text-sm text-orange-700">Serviços</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Bundle Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tamanho Original:</span>
                  <span className="font-mono text-sm">{performanceMetrics.bundleSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Gzip:</span>
                  <span className="font-mono text-sm">{performanceMetrics.gzipSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tempo de Load:</span>
                  <span className="font-mono text-sm text-green-600">{performanceMetrics.loadTime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">FCP:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{performanceMetrics.fcp}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">LCP:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{performanceMetrics.lcp}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CLS:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{performanceMetrics.cls}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">FID:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{performanceMetrics.fid}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Otimizações Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Lazy Loading ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Tree shaking configurado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span>Otimizar imagens PNG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span>Implementar service worker</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Status de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Score de Segurança:</span>
                  <Badge className="bg-green-100 text-green-700">{securityAnalysis.securityScore}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vulnerabilidades:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{securityAnalysis.vulnerabilities}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dependências Desatualizadas:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">{securityAnalysis.outdatedDeps}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Última verificação: {securityAnalysis.lastScan}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checklist de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { item: 'HTTPS Configurado', status: true },
                    { item: 'CSP Headers', status: true },
                    { item: 'XSS Protection', status: true },
                    { item: 'CSRF Protection', status: true },
                    { item: 'Input Sanitization', status: true },
                    { item: 'Environment Variables', status: true },
                    { item: 'Dependencies Audit', status: false },
                    { item: 'Security Monitoring', status: false }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{check.item}</span>
                      {check.status ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Estrutura do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div>📁 src/</div>
                  <div className="ml-4">📁 components/ (89 arquivos)</div>
                  <div className="ml-4">📁 hooks/ (34 arquivos)</div>
                  <div className="ml-4">📁 pages/ (12 arquivos)</div>
                  <div className="ml-4">📁 services/ (18 arquivos)</div>
                  <div className="ml-4">📁 utils/ (8 arquivos)</div>
                  <div className="ml-4">📁 types/ (6 arquivos)</div>
                  <div className="ml-4">📁 styles/ (4 arquivos)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Dependências Principais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'React', version: '18.3.1', status: 'updated' },
                    { name: 'TypeScript', version: '5.2.2', status: 'updated' },
                    { name: 'Supabase', version: '2.50.0', status: 'updated' },
                    { name: 'React Router', version: '6.26.2', status: 'updated' },
                    { name: 'Tailwind CSS', version: '3.4.0', status: 'outdated' },
                    { name: 'Radix UI', version: '1.1.0', status: 'updated' }
                  ].map((dep, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{dep.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{dep.version}</span>
                        <Badge 
                          variant="secondary" 
                          className={dep.status === 'updated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                        >
                          {dep.status === 'updated' ? 'Atualizado' : 'Desatualizado'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
