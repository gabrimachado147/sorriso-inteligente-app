
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DeveloperBreadcrumbs } from '@/components/Developer/DeveloperBreadcrumbs';
import { DeveloperPageHeader } from '@/components/Developer/DeveloperPageHeader';
import { DeveloperSuccessStories } from '@/components/Developer/DeveloperSuccessStories';
import { EnhancedDeveloperNavigation } from '@/components/Developer/EnhancedDeveloperNavigation';
import { DeveloperTutorialGuide } from '@/components/Developer/DeveloperTutorialGuide';
import { DeveloperGamificationChallenge } from '@/components/Developer/DeveloperGamificationChallenge';
import { LiveAnalysisTab } from '@/components/Developer/LiveAnalysisTab';
import { AIAssistantTab } from '@/components/Developer/AIAssistantTab';
import { SystemTab } from '@/components/Developer/SystemTab';
import { OtherTabsContent } from '@/components/Developer/OtherTabsContent';
import { PerformanceMonitor } from '@/components/Developer/PerformanceMonitor';
import { EnhancedAIPageAnalyzer } from '@/components/Developer/EnhancedAIPageAnalyzer';
import { DeveloperErrorBoundary } from '@/components/Developer/DeveloperErrorBoundary';
import { useDevelopmentPanel } from '@/hooks/useDevelopmentPanel';
import { useDeveloperOptimization } from '@/hooks/useDeveloperOptimization';
import { animations } from '@/lib/animations';

const DeveloperPage = () => {
  const { isSupabaseConfigured, projectInfo } = useDevelopmentPanel();
  const { performanceScore, loading: optimizationLoading } = useDeveloperOptimization();
  const [activeSection, setActiveSection] = useState('live-analysis');

  const renderContent = () => {
    switch (activeSection) {
      case 'live-analysis':
        return <LiveAnalysisTab />;
      case 'ai-assistant':
        return <AIAssistantTab />;
      case 'tutorial':
        return (
          <TabsContent value="tutorial" className="space-y-6 mt-6">
            <DeveloperTutorialGuide />
          </TabsContent>
        );
      case 'challenges':
        return (
          <TabsContent value="challenges" className="space-y-6 mt-6">
            <DeveloperGamificationChallenge />
          </TabsContent>
        );
      case 'performance':
        return (
          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
              <div className="relative">
                <PerformanceMonitor />
              </div>
            </div>
          </TabsContent>
        );
      case 'system':
        return (
          <TabsContent value="system" className="space-y-6 mt-6">
            <SystemTab 
              projectInfo={projectInfo} 
              isSupabaseConfigured={isSupabaseConfigured} 
            />
          </TabsContent>
        );
      default:
        return <OtherTabsContent />;
    }
  };

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
                <DeveloperPageHeader />

                {/* Success Stories Section */}
                <DeveloperErrorBoundary>
                  <DeveloperSuccessStories />
                </DeveloperErrorBoundary>

                {/* Performance Score Overview */}
                {!optimizationLoading && performanceScore > 0 && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-3 rounded-full border border-green-200">
                      <span className="text-sm font-medium">Performance Score:</span>
                      <span className={`text-xl font-bold ${
                        performanceScore >= 80 ? 'text-green-600' : 
                        performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {performanceScore}/100
                      </span>
                    </div>
                  </div>
                )}

                {/* Enhanced AI Page Analyzer */}
                <DeveloperErrorBoundary>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl" />
                    <div className="relative">
                      <EnhancedAIPageAnalyzer />
                    </div>
                  </div>
                </DeveloperErrorBoundary>

                {/* Main Layout with Enhanced Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Enhanced Navigation Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <EnhancedDeveloperNavigation 
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                      />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/40 rounded-2xl blur-2xl" />
                      <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
                        <Tabs value={activeSection} className="w-full p-6">
                          {renderContent()}
                        </Tabs>
                      </div>
                    </div>
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
