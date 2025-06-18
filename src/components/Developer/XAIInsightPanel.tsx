
import React from 'react';
import { useXAIInsightPanel } from '@/hooks/useXAIInsightPanel';
import { XAIConfigurationWarning } from './XAIConfigurationWarning';
import { XAIPromptInput } from './XAIPromptInput';
import { XAIQuickPrompts } from './XAIQuickPrompts';
import { XAIInsightDisplay } from './XAIInsightDisplay';

interface XAIInsightPanelProps {
  onInsight?: (insight: string) => void;
}

export const XAIInsightPanel: React.FC<XAIInsightPanelProps> = ({ onInsight }) => {
  const {
    prompt,
    setPrompt,
    insight,
    expandedPrompt,
    setExpandedPrompt,
    loading,
    configured,
    handleGenerateInsight,
    handleRefreshConfig,
    checkConfiguration
  } = useXAIInsightPanel(onInsight);

  React.useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]);

  if (!configured) {
    return <XAIConfigurationWarning onRefreshConfig={handleRefreshConfig} />;
  }

  return (
    <div className="space-y-4">
      <XAIPromptInput
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerateInsight={handleGenerateInsight}
        onRefreshConfig={handleRefreshConfig}
        loading={loading}
      />

      <XAIQuickPrompts
        expandedPrompt={expandedPrompt}
        onExpandPrompt={setExpandedPrompt}
        onSelectPrompt={setPrompt}
      />

      <XAIInsightDisplay insight={insight} />
    </div>
  );
};
