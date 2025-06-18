
export interface DataItem {
  id: string;
  value: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, any>;
}

export interface OptimizedProps {
  data: ReadonlyArray<DataItem>;
  onUpdate: (id: string, updates: Partial<DataItem>) => void;
  loading?: boolean;
}

export interface CodeAnalysisResult {
  complexity: number;
  maintainability: number;
  testability: number;
  suggestions: string[];
  optimizations: CodeOptimization[];
}

export interface CodeOptimization {
  type: 'performance' | 'security' | 'maintainability';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  codeExample?: string;
  impact: string;
  effort: string;
}

export interface DeveloperMetrics {
  bundleSize: string;
  performance: number;
  security: number;
  codeQuality: number;
  testCoverage: number;
}
