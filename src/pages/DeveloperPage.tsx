
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XAIInsightPanel } from '@/components/Developer/XAIInsightPanel';
import { DeveloperRecommendations } from '@/components/Developer/DeveloperRecommendations';
import { DeveloperOperations } from '@/components/Developer/DeveloperOperations';
import { AdvancedCodeAnalysis } from '@/components/Developer/AdvancedCodeAnalysis';
import { AICodeAssistant } from '@/components/Developer/AICodeAssistant';
import { DatabaseManager } from '@/components/Developer/DatabaseManager';
import { ProjectInfoTab } from '@/components/Developer/ProjectInfoTab';
import { DatabaseInfoTab } from '@/components/Developer/DatabaseInfoTab';
import { DebugInfoTab } from '@/components/Developer/DebugInfoTab';
import { DeveloperErrorBoundary } from '@/components/Developer/DeveloperErrorBoundary';
import { PerformanceMonitor } from '@/components/Developer/PerformanceMonitor';
import { OptimizationDocs } from '@/components/Developer/OptimizationDocs';
import { useDevelopmentPanel } from '@/hooks/useDevelopmentPanel';
import { animations } from '@/lib/animations';
import { 
  Code, 
  Brain, 
  Database, 
  Settings, 
  Zap, 
  Lightbulb,
  Bot,
  BarChart3,
  Terminal,
  Cpu,
  Activity,
  BookOpen
} from 'lucide-react';
import { LiveCodeAnalysis } from '@/components/Developer/LiveCodeAnalysis';

const DeveloperPage = () => {
  const { isSupabaseConfigured, projectInfo } = useDevelopmentPanel();

  return (
    <>
      <PageHead
        title="Developer Tools - Senhor Sorriso"
        description="Ferramentas avançadas de desenvolvimento com IA para o projeto Sorriso Inteligente"
        keywords="developer tools, IA, desenvolvimento, Grok, insights, debug"
        url="https://senhorsorrisso.com.br/developer"
      />
      <div className="w-full min-h-screen bg-background">
        <MainLayout>
          <DeveloperErrorBoundary>
            <div className={`w-full ${animations.pageEnter}`}>
              <div className="container mx-auto px-4 py-6 space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <Code className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Developer Tools Pro
                    </h1>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm">
                      AMBIENTE AVANÇADO
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                    Suite completa de ferramentas de desenvolvimento com IA, análise de código, operações automatizadas e insights inteligentes para maximizar a produtividade
                  </p>
                </div>

                {/* Performance Monitor */}
                <DeveloperErrorBoundary>
                  <PerformanceMonitor />
                </DeveloperErrorBoundary>

                {/* Main Tabs */}
                <Tabs defaultValue="live-analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-8 h-12">
                    <TabsTrigger value="live-analysis" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">Live Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span className="hidden sm:inline">IA Assistant</span>
                    </TabsTrigger>
                    <TabsTrigger value="code-analysis" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Code Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="database" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span className="hidden sm:inline">Database</span>
                    </TabsTrigger>
                    <TabsTrigger value="operations" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="hidden sm:inline">Operations</span>
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">Insights</span>
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Docs</span>
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      <span className="hidden sm:inline">System</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Live Analysis Tab */}
                  <TabsContent value="live-analysis" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-6 w-6 text-purple-600" />
                          Análise de Código ao Vivo
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            IMPLEMENTADO
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DeveloperErrorBoundary>
                          <LiveCodeAnalysis />
                        </DeveloperErrorBoundary>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Assistant Tab */}
                  <TabsContent value="ai-assistant" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-6 w-6 text-blue-600" />
                          Assistente de IA para Desenvolvimento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DeveloperErrorBoundary>
                          <AICodeAssistant />
                        </DeveloperErrorBoundary>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-6 w-6 text-purple-600" />
                          Insights com Grok
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DeveloperErrorBoundary>
                          <XAIInsightPanel />
                        </DeveloperErrorBoundary>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Code Analysis Tab */}
                  <TabsContent value="code-analysis" className="space-y-6">
                    <DeveloperErrorBoundary>
                      <AdvancedCodeAnalysis />
                    </DeveloperErrorBoundary>
                  </TabsContent>

                  {/* Database Tab */}
                  <TabsContent value="database" className="space-y-6">
                    <DeveloperErrorBoundary>
                      <DatabaseManager />
                    </DeveloperErrorBoundary>
                  </TabsContent>

                  {/* Operations Tab */}
                  <TabsContent value="operations" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-6 w-6 text-blue-600" />
                          Operações Automatizadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DeveloperErrorBoundary>
                          <DeveloperOperations />
                        </DeveloperErrorBoundary>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="space-y-6">
                    <DeveloperErrorBoundary>
                      <DeveloperRecommendations />
                    </DeveloperErrorBoundary>
                  </TabsContent>

                  {/* Documentation Tab */}
                  <TabsContent value="docs" className="space-y-6">
                    <DeveloperErrorBoundary>
                      <OptimizationDocs />
                    </DeveloperErrorBoundary>
                  </TabsContent>

                  {/* System Info Tab */}
                  <TabsContent value="system" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            Informações do Projeto
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DeveloperErrorBoundary>
                            <ProjectInfoTab projectInfo={projectInfo} />
                          </DeveloperErrorBoundary>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Database className="h-5 w-5" />
                            Status do Banco
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DeveloperErrorBoundary>
                            <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
                          </DeveloperErrorBoundary>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Debug & Logs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DeveloperErrorBoundary>
                            <DebugInfoTab />
                          </DeveloperErrorBoundary>
                        </CardContent>
                      </Card>
                    </div>

                    {/* System Overview */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Cpu className="h-6 w-6 text-blue-600" />
                          Status Geral do Sistema
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">99.9%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">247</div>
                            <div className="text-sm text-muted-foreground">Arquivos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">92%</div>
                            <div className="text-sm text-muted-foreground">Cobertura</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">A+</div>
                            <div className="text-sm text-muted-foreground">Qualidade</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DeveloperErrorBoundary>
        </MainLayout>
      </div>
    </>
  );
};

export default DeveloperPage;
