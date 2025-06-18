
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Bot, 
  BarChart3, 
  Database, 
  Zap, 
  Lightbulb, 
  BookOpen, 
  Cpu 
} from 'lucide-react';

export const DeveloperTabsList: React.FC = () => {
  return (
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
  );
};
