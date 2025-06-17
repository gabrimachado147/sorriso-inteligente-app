
import React, { useMemo, useCallback, useState } from 'react';
import { VirtualizedList } from '@/components/ui/VirtualizedList';
import { MemoizedPatientCard } from './MemoizedPatientCard';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface OptimizedPatientListProps {
  onViewDetails?: (patientId: string) => void;
  onScheduleAppointment?: (patientId: string) => void;
}

export const OptimizedPatientList: React.FC<OptimizedPatientListProps> = ({
  onViewDetails,
  onScheduleAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Build filters object
  const filters = useMemo(() => {
    const result: Record<string, any> = {};
    
    if (debouncedSearchTerm) {
      result.name = debouncedSearchTerm;
    }
    
    if (statusFilter !== 'all') {
      result.status = statusFilter;
    }
    
    return result;
  }, [debouncedSearchTerm, statusFilter]);

  // Use optimized query with caching and pagination
  const {
    data: patients,
    loading,
    error,
    currentPage,
    totalCount,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refetch
  } = useOptimizedQuery({
    table: 'user_profiles', // Replace with actual patients table
    select: '*',
    filters,
    orderBy: { column: 'full_name', ascending: true },
    pageSize: 50,
    cacheKey: `patients-${JSON.stringify(filters)}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes cache
    realtime: true
  });

  // Memoized render function for virtual list
  const renderPatientItem = useCallback((patient: any, index: number) => {
    return (
      <MemoizedPatientCard
        key={patient.id}
        patient={{
          id: patient.id,
          name: patient.full_name || 'Nome não informado',
          phone: patient.phone || '',
          email: patient.email,
          status: 'active', // You might want to add this field to your schema
          city: patient.city
        }}
        onViewDetails={onViewDetails}
        onScheduleAppointment={onScheduleAppointment}
        variant="compact"
      />
    );
  }, [onViewDetails, onScheduleAppointment]);

  // Memoized filters section
  const FiltersSection = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        onClick={refetch}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  ), [searchTerm, statusFilter, refetch, loading]);

  // Memoized pagination section
  const PaginationSection = useMemo(() => (
    <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600">
        Mostrando {patients.length} de {totalCount} pacientes
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={!hasPrevPage || loading}
        >
          Anterior
        </Button>
        
        <span className="text-sm text-gray-600 px-3">
          Página {currentPage}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!hasNextPage || loading}
        >
          Próxima
        </Button>
      </div>
    </div>
  ), [patients.length, totalCount, currentPage, hasPrevPage, hasNextPage, prevPage, nextPage, loading]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Erro ao carregar pacientes: {error}</p>
        <Button onClick={refetch}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {FiltersSection}
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Lista de Pacientes</h2>
        </div>
        
        <div className="p-4">
          <VirtualizedList
            items={patients}
            renderItem={renderPatientItem}
            itemHeight={120}
            height={600}
            loading={loading}
            emptyMessage="Nenhum paciente encontrado com os filtros aplicados"
          />
        </div>
      </div>
      
      {PaginationSection}
    </div>
  );
};
