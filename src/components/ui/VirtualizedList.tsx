
import React, { memo, useMemo } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight?: number | ((index: number) => number);
  height?: number;
  width?: string | number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const LoadingRow = memo(({ style }: { style: React.CSSProperties }) => (
  <div style={style} className="p-2">
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  </div>
));

const EmptyState = memo(({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-500">
    <div className="text-center">
      <p className="text-lg font-medium mb-2">Nenhum item encontrado</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
));

export const VirtualizedList: React.FC<VirtualizedListProps> = memo(({
  items,
  renderItem,
  itemHeight = 80,
  height = 400,
  width = '100%',
  loading = false,
  emptyMessage = 'Nenhum item para exibir',
  className = ''
}) => {
  const isVariableHeight = typeof itemHeight === 'function';

  // Memoize row renderer for performance
  const Row = useMemo(() => {
    return memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (loading) {
        return <LoadingRow style={style} />;
      }

      if (index >= items.length) {
        return null;
      }

      return (
        <div style={style} className="p-1">
          {renderItem(items[index], index)}
        </div>
      );
    });
  }, [items, renderItem, loading]);

  // Show empty state when no items and not loading
  if (!loading && items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const itemCount = loading ? Math.max(10, items.length) : items.length;

  const commonProps = {
    height,
    width,
    itemCount,
    className: `virtualized-list ${className}`,
    children: Row
  };

  if (isVariableHeight) {
    return (
      <VariableSizeList
        {...commonProps}
        itemSize={itemHeight as (index: number) => number}
      />
    );
  }

  return (
    <List
      {...commonProps}
      itemSize={itemHeight as number}
    />
  );
});

VirtualizedList.displayName = 'VirtualizedList';
