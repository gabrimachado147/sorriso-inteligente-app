
import { DataItem } from './developer';

export interface OptimizedProps {
  data: ReadonlyArray<DataItem>;
  onUpdate: (id: string, updates: Partial<DataItem>) => void;
  loading?: boolean;
}

export interface DataProcessorStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  averageValue: number;
}

export interface ProcessorActions {
  updateItem: (id: string, updates: Partial<DataItem>) => void;
  removeItem: (id: string) => void;
  addItem: (newItem: DataItem) => void;
  setLoadingState: (loading: boolean) => void;
}
