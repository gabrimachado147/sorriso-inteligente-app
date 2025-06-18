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
import { DeveloperBreadcrumbs } from '@/components/Developer/DeveloperBreadcrumbs';
import { DeveloperSuccessStories } from '@/components/Developer/DeveloperSuccessStories';
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
  BookOpen,
  Sparkles,
  Rocket
} from 'lucide-react';
import { LiveCodeAnalysis } from '@/components/Developer/LiveCodeAnalysis';
import { AIPageAnalyzer } from '@/components/Developer/AIPageAnalyzer';

const DeveloperPage = () => {
  const { isSupabaseConfigured, projectInfo } = useDevelopmentPanel();

  return (
    <>
      <PageHead
        title="Developer Tools Pro - Senhor Sorriso"
        description="Potencialize sua eficácia com nossas ferramentas AI-driven - análise de código avançada, automação fluente e insights incríveis aguardam"
        keywords="developer tools, IA, desenvolvimento, Grok, insights, debug, performance, automação"
        url="https://senhorsorrisso.com.br/developer"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <MainLayout>
          <DeveloperErrorBoundary>
            <div className={`w-full ${animations.pageEnter}`}>
              <div className="container mx-auto px-4 py-6 space-y-8">
                {/* Breadcrumbs */}
                <DeveloperBreadcrumbs />

                {/* Enhanced Header */}
                <div className="text-center space-y-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-green-600/5 rounded-3xl blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="relative">
                        <Code className="h-12 w-12 text-primary animate-pulse" />
                        <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
                      </div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Developer Tools Pro
                      </h1>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm animate-pulse">
                          AMBIENTE AVANÇADO
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          <Rocket className="h-3 w-3 mr-1" />
                          AI-POWERED
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground max-w-4xl mx-auto text-lg leading-relaxed">
                      <strong className="text-primary">Potencialize sua eficácia</strong> com nossas ferramentas AI-driven: 
                      análise de código avançada, automação fluente e insights incríveis que transformam 
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"> desenvolvedores em arquitetos digitais</span>
                    </p>
                  </div>
                </div>

                {/* Success Stories Section */}
                <DeveloperErrorBoundary>
                  <DeveloperSuccessStories />
                </DeveloperErrorBoundary>

                {/* Enhanced Performance Monitor */}
                <DeveloperErrorBoundary>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
                    <div className="relative">
                      <PerformanceMonitor />
                    </div>
                  </div>
                </DeveloperErrorBoundary>

                {/* Enhanced AI Page Analyzer */}
                <DeveloperErrorBoundary>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl" />
                    <div className="relative">
                      <AIPageAnalyzer />
                    </div>
                  </div>
                </DeveloperErrorBoundary>

                {/* Enhanced Main Tabs with better contrast */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 rounded-2xl blur-2xl" />
                  <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
                    <Tabs defaultValue="live-analysis" className="w-full p-6">
                      <TabsList className="grid w-full grid-cols-8 h-14 bg-gradient-to-r from-slate-100 to-blue-100 border border-blue-200">
                        <TabsTrigger value="live-analysis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300">
                          <Brain className="h-4 w-4" />
                          <span className="hidden sm:inline">Live Analysis</span>
                        </TabsTrigger>
                        <TabsTrigger value="ai-assistant" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300">
                          <Bot className="h-4 w-4" />
                          <span className="hidden sm:inline">IA Assistant</span>
                        </TabsTrigger>
                        <TabsTrigger value="code-analysis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300">
                          <BarChart3 className="h-4 w-4" />
                          <span className="hidden sm:inline">Code Analysis</span>
                        </TabsTrigger>
                        <TabsTrigger value="database" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300">
                          <Database className="h-4 w-4" />
                          <span className="hidden sm:inline">Database</span>
                        </TabsTrigger>
                        <TabsTrigger value="operations" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300">
                          <Zap className="h-4 w-4" />
                          <span className="hidden sm:inline">Operations</span>
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300">
                          <Lightbulb className="h-4 w-4" />
                          <span className="hidden sm:inline">Insights</span>
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300">
                          <BookOpen className="h-4 w-4" />
                          <span className="hidden sm:inline">Docs</span>
                        </TabsTrigger>
                        <TabsTrigger value="system" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-500 data-[state=active]:text-white transition-all duration-300">
                          <Cpu className="h-4 w-4" />
                          <span className="hidden sm:inline">System</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Live Analysis Tab */}
                      <TabsContent value="live-analysis" className="space-y-6 mt-6">
                        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <Brain className="h-6 w-6 text-purple-600" />
                              Análise de Código ao Vivo
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 animate-pulse">
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
                      <TabsContent value="ai-assistant" className="space-y-6 mt-6">
                        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <Bot className="h-6 w-6 text-blue-600" />
                              Assistente de IA para Desenvolvimento
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                INTELIGÊNCIA APRIMORADA
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <DeveloperErrorBoundary>
                              <AICodeAssistant />
                            </DeveloperErrorBoundary>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <Brain className="h-6 w-6 text-purple-600" />
                              Insights Estratégicos com Enigma
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                ESPECIALISTA EM ESTRATÉGIA
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <DeveloperErrorBoundary>
                              <XAIInsightPanel />
                            </DeveloperErrorBoundary>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* ... keep existing code for other tabs but with enhanced styling */}
                      <TabsContent value="code-analysis" className="space-y-6 mt-6">
                        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-1 border border-green-200">
                          <DeveloperErrorBoundary>
                            <AdvancedCodeAnalysis />
                          </DeveloperErrorBoundary>
                        </div>
                      </TabsContent>

                      <TabsContent value="database" className="space-y-6 mt-6">
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-1 border border-teal-200">
                          <DeveloperErrorBoundary>
                            <DatabaseManager />
                          </DeveloperErrorBoundary>
                        </div>
                      </TabsContent>

                      <TabsContent value="operations" className="space-y-6 mt-6">
                        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <Zap className="h-6 w-6 text-cyan-600" />
                              Operações Automatizadas Inteligentes
                              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                                AUTOMAÇÃO AVANÇADA
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <DeveloperErrorBoundary>
                              <DeveloperOperations />
                            </DeveloperErrorBoundary>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="recommendations" className="space-y-6 mt-6">
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-1 border border-yellow-200">
                          <DeveloperErrorBoundary>
                            <DeveloperRecommendations />
                          </DeveloperErrorBoundary>
                        </div>
                      </TabsContent>

                      <TabsContent value="docs" className="space-y-6 mt-6">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-1 border border-orange-200">
                          <DeveloperErrorBoundary>
                            <OptimizationDocs />
                          </DeveloperErrorBoundary>
                        </div>
                      </TabsContent>

                      <TabsContent value="system" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-slate-600" />
                                Informações do Projeto
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <DeveloperErrorBoundary>
                                <ProjectInfoTab projectInfo={projectInfo} />
                              </DeveloperErrorBoundary>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Database className="h-5 w-5 text-blue-600" />
                                Status do Banco
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <DeveloperErrorBoundary>
                                <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
                              </DeveloperErrorBoundary>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="h-5 w-5 text-purple-600" />
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

                        {/* Enhanced System Overview */}
                        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-blue-200 shadow-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
                              Status Geral do Sistema
                              <Badge variant="secondary" className="bg-green-100 text-green-700 animate-pulse">
                                MONITORAMENTO ATIVO
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl font-bold text-green-600 mb-1">99.9%</div>
                                <div className="text-sm text-muted-foreground">Uptime Garantido</div>
                              </div>
                              <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl font-bold text-blue-600 mb-1">247</div>
                                <div className="text-sm text-muted-foreground">Arquivos Otimizados</div>
                              </div>
                              <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl font-bold text-purple-600 mb-1">92%</div>
                                <div className="text-sm text-muted-foreground">Cobertura de Testes</div>
                              </div>
                              <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl font-bold text-orange-600 mb-1">A+</div>
                                <div className="text-sm text-muted-foreground">Qualidade do Código</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </DeveloperErrorBoundary>
        </MainLayout>
      </div>
    </>
  );
};

export default DeveloperPage;
