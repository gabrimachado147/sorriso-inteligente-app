
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { Tabs } from '@/components/ui/tabs';
import { DeveloperBreadcrumbs } from '@/components/Developer/DeveloperBreadcrumbs';
import { DeveloperPageHeader } from '@/components/Developer/DeveloperPageHeader';
import { DeveloperSuccessStories } from '@/components/Developer/DeveloperSuccessStories';
import { DeveloperTabsList } from '@/components/Developer/DeveloperTabsList';
import { LiveAnalysisTab } from '@/components/Developer/LiveAnalysisTab';
import { AIAssistantTab } from '@/components/Developer/AIAssistantTab';
import { SystemTab } from '@/components/Developer/SystemTab';
import { OtherTabsContent } from '@/components/Developer/OtherTabsContent';
import { PerformanceMonitor } from '@/components/Developer/PerformanceMonitor';
import { AIPageAnalyzer } from '@/components/Developer/AIPageAnalyzer';
import { DeveloperErrorBoundary } from '@/components/Developer/DeveloperErrorBoundary';
import { useDevelopmentPanel } from '@/hooks/useDevelopmentPanel';
import { animations } from '@/lib/animations';

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
                <DeveloperPageHeader />

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
                      <DeveloperTabsList />
                      <LiveAnalysisTab />
                      <AIAssistantTab />
                      <OtherTabsContent />
                      <SystemTab 
                        projectInfo={projectInfo} 
                        isSupabaseConfigured={isSupabaseConfigured} 
                      />
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
