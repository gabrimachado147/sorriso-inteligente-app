
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, FileText, Database, Eye } from 'lucide-react';

interface DevelopmentPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DevelopmentPanelTabs: React.FC<DevelopmentPanelTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        variant={activeTab === 'insights' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTabChange('insights')}
        className="text-xs"
      >
        <Zap className="h-3 w-3 mr-1" />
        AI Insights
      </Button>
      <Button
        variant={activeTab === 'project' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTabChange('project')}
        className="text-xs"
      >
        <FileText className="h-3 w-3 mr-1" />
        Projeto
      </Button>
      <Button
        variant={activeTab === 'db' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTabChange('db')}
        className="text-xs"
      >
        <Database className="h-3 w-3 mr-1" />
        Database
      </Button>
      <Button
        variant={activeTab === 'debug' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTabChange('debug')}
        className="text-xs"
      >
        <Eye className="h-3 w-3 mr-1" />
        Debug
      </Button>
    </div>
  );
};
