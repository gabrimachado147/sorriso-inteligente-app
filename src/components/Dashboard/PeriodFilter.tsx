
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

interface PeriodFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value,
  onChange,
  className = ""
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`min-w-[150px] ${className}`}>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <SelectValue placeholder="Período" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os Períodos</SelectItem>
        <SelectItem value="today">Hoje</SelectItem>
        <SelectItem value="yesterday">Ontem</SelectItem>
        <SelectItem value="week">Esta Semana</SelectItem>
        <SelectItem value="last_week">Semana Passada</SelectItem>
        <SelectItem value="month">Este Mês</SelectItem>
        <SelectItem value="last_month">Mês Passado</SelectItem>
        <SelectItem value="quarter">Este Trimestre</SelectItem>
        <SelectItem value="last_quarter">Trimestre Passado</SelectItem>
        <SelectItem value="year">Este Ano</SelectItem>
        <SelectItem value="last_year">Ano Passado</SelectItem>
      </SelectContent>
    </Select>
  );
};
