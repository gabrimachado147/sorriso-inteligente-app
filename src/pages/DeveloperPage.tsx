
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XAIInsightPanel } from '@/components/Developer/XAIInsightPanel';
import { DeveloperRecommendations } from '@/components/Developer/DeveloperRecommendations';
import { DeveloperOperations } from '@/components/Developer/DeveloperOperations';
import { ProjectInfoTab } from '@/components/Developer/ProjectInfoTab';
import { DatabaseInfoTab } from '@/components/Developer/DatabaseInfoTab';
import { DebugInfoTab } from '@/components/Developer/DebugInfoTab';
import { useDevelopmentPanel } from '@/hooks/useDevelopmentPanel';
import { animations } from '@/lib/animations';
import { Code, Brain, Database, Settings, Zap } from 'lucide-react';

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
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="container mx-auto px-4 py-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Code className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold">Developer Tools</h1>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    AMBIENTE DE DESENVOLVIMENTO
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ferramentas avançadas de desenvolvimento com insights de IA, operações automatizadas e recomendações inteligentes
                </p>
              </div>

              {/* AI Insights Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    Insights de IA com Grok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <XAIInsightPanel />
                </CardContent>
              </Card>

              {/* Operations and Recommendations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-blue-600" />
                      Operações Automatizadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeveloperOperations />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-6 w-6 text-green-600" />
                      Recomendações Inteligentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeveloperRecommendations />
                  </CardContent>
                </Card>
              </div>

              {/* Information Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projeto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectInfoTab projectInfo={projectInfo} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-5 w-5" />
                      Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DatabaseInfoTab isSupabaseConfigured={isSupabaseConfigured} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Debug Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DebugInfoTab />
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

export default DeveloperPage;
