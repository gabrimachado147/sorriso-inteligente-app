
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCaching } from './useCaching';
import { useDebounce } from './useDebounce';

interface QueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  pageSize?: number;
  cacheKey?: string;
  cacheTTL?: number;
  realtime?: boolean;
}

interface PaginatedResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

export const useOptimizedQuery = <T = any>(
  options: QueryOptions
): PaginatedResult<T> => {
  const {
    table,
    select = '*',
    filters = {},
    orderBy,
    pageSize = 20,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    realtime = false
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Use caching if cache key is provided
  const { cachedData, setCache, hasCache } = useCaching<{
    data: T[];
    totalCount: number;
    timestamp: number;
  }>({
    key: cacheKey || `${table}-${JSON.stringify(filters)}-${currentPage}`,
    ttl: cacheTTL
  });

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300);

  const fetchData = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cacheKey && cachedData && Date.now() - cachedData.timestamp < cacheTTL) {
        console.log('Using cached data for:', cacheKey);
        setData(cachedData.data);
        setTotalCount(cachedData.totalCount);
        setLoading(false);
        return;
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      // Build query
      let query = supabase.from(table).select(select, { count: 'exact' });

      // Apply filters
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string') {
            query = query.ilike(key, `%${value}%`);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      // Apply pagination
      query = query.range(start, end);

      const { data: result, error: queryError, count } = await query;

      if (queryError) {
        throw queryError;
      }

      const fetchedData = result || [];
      const total = count || 0;

      setData(fetchedData);
      setTotalCount(total);

      // Cache the result
      if (cacheKey) {
        setCache({
          data: fetchedData,
          totalCount: total,
          timestamp: Date.now()
        });
      }

      console.log(`Fetched ${fetchedData.length} items from ${table}`);
    } catch (err) {
      console.error('Query error:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [table, select, debouncedFilters, orderBy, pageSize, currentPage, cacheKey, cacheTTL, cachedData, setCache]);

  // Memoized pagination helpers
  const paginationHelpers = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    
    return {
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage: () => {
        if (currentPage < totalPages) {
          const newPage = currentPage + 1;
          setCurrentPage(newPage);
          fetchData(newPage);
        }
      },
      prevPage: () => {
        if (currentPage > 1) {
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          fetchData(newPage);
        }
      },
      setPage: (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
          fetchData(page);
        }
      }
    };
  }, [currentPage, totalCount, pageSize, fetchData]);

  const refetch = useCallback(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    fetchData(1);
    setCurrentPage(1);
  }, [table, select, debouncedFilters, orderBy, pageSize]);

  // Setup realtime subscription
  useEffect(() => {
    if (!realtime) return;

    console.log('Setting up realtime subscription for:', table);
    
    const subscription = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log('Realtime update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      subscription.unsubscribe();
    };
  }, [table, realtime, refetch]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalCount,
    ...paginationHelpers,
    refetch
  };
};
