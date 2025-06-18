
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

  const addItem = useCallback((newItem: DataItem) => {
    setData(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const expensiveCalculation = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => item.status === 'active');
  }, [data]);

  const performBatchUpdate = useCallback(async (updates: Array<{id: string, updates: Partial<DataItem>}>) => {
    setLoading(true);
    try {
      // Simular operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(prev => {
        const newData = [...prev];
        updates.forEach(({ id, updates: itemUpdates }) => {
          const index = newData.findIndex(item => item.id === id);
          if (index !== -1) {
            newData[index] = { ...newData[index], ...itemUpdates };
          }
        });
        return newData;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    data, 
    filteredData,
    loading, 
    updateItem, 
    addItem, 
    removeItem,
    performBatchUpdate,
    totalValue: expensiveCalculation,
    activeCount: filteredData.length
  };
};
