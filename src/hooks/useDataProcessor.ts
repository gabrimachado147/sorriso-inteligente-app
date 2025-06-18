
import { useState, useCallback, useMemo } from 'react';
import { DataItem } from '@/types/developer';

export const useDataProcessor = (initialData: DataItem[]) => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [loading, setLoading] = useState(false);

  const updateItem = useCallback((id: string, updates: Partial<DataItem>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const addItem = useCallback((newItem: DataItem) => {
    setData(prev => [...prev, newItem]);
  }, []);

  // Expensive calculation with useMemo optimization
  const expensiveCalculation = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  const statistics = useMemo(() => {
    const activeItems = data.filter(item => item.status === 'active');
    const inactiveItems = data.filter(item => item.status === 'inactive');
    const pendingItems = data.filter(item => item.status === 'pending');

    return {
      total: data.length,
      active: activeItems.length,
      inactive: inactiveItems.length,
      pending: pendingItems.length,
      averageValue: data.length > 0 ? expensiveCalculation / data.length : 0
    };
  }, [data, expensiveCalculation]);

  const setLoadingState = useCallback((loadingState: boolean) => {
    setLoading(loadingState);
  }, []);

  return { 
    data, 
    loading, 
    updateItem, 
    removeItem, 
    addItem, 
    statistics, 
    expensiveCalculation,
    setLoadingState 
  };
};
